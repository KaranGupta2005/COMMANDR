"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api/client";
import {
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Activity,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

/* ---------- Types ---------- */
type MissionStatus =
  | "pending"
  | "enroute"
  | "active"
  | "completed"
  | "cancelled";

interface Mission {
  _id: string;
  emergencyId: string | { _id: string; type: string; location: { lat: number; lng: number } };
  rescueTeamId: string | { _id: string; fullName: string };
  vehiclesAssigned: string[];
  status: MissionStatus;
  eta?: string;
  startedAt?: string;
  completedAt?: string;
  route?: any;
}

/* ---------- Helpers ---------- */
function formatETA(date?: string) {
  if (!date) return "—";
  const now = new Date();
  const target = new Date(date);
  const diff = Math.max(target.getTime() - now.getTime(), 0);
  const mins = Math.round(diff / 60000);
  return mins <= 0 ? "Now" : `${mins} min`;
}

const STATUS_ORDER: MissionStatus[] = [
  "pending",
  "enroute",
  "active",
  "completed",
  "cancelled",
];

const statusStyles: Record<MissionStatus, string> = {
  pending: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  enroute: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  completed: "bg-green-500/20 text-green-400 border-green-500/40",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/40",
};

const statusIcons: Record<MissionStatus, React.ReactNode> = {
  pending: <Clock size={14} />,
  enroute: <Truck size={14} />,
  active: <Activity size={14} />,
  completed: <CheckCircle size={14} />,
  cancelled: <XCircle size={14} />,
};

/* ---------- Page ---------- */
export default function LiveMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingMission, setUpdatingMission] = useState<string | null>(null);

  /* ---------- BULLETPROOF FETCH ---------- */
  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/missions/my");
      setMissions(res.data.missions || res.data.data || []);
    } catch (err: any) {
      console.error("❌ Failed to fetch missions:", err);
      setError(
        err.response?.status === 401
          ? "Please log in as a rescue team member"
          : "Failed to load missions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------- REFRESH ON MOUNT & INTERVAL ---------- */
  useEffect(() => {
    fetchMissions();
    const interval = setInterval(fetchMissions, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchMissions]);

  /* ---------- SORT BY PRIORITY ---------- */
  const sortedMissions = useMemo(() => {
    const priority: Record<MissionStatus, number> = {
      active: 0,
      enroute: 1,
      pending: 2,
      completed: 3,
      cancelled: 4,
    };

    return [...missions].sort(
      (a, b) => priority[a.status as MissionStatus] - priority[b.status as MissionStatus]
    );
  }, [missions]);

  /* ---------- UPDATE STATUS WITH ERROR HANDLING ---------- */
  const updateStatus = async (id: string, status: MissionStatus) => {
    setUpdatingMission(id);
    setError("");
    
    try {
      await api.patch(`/missions/${id}/status`, { status });
      
      // Optimistic update
      setMissions((prev) =>
        prev.map((m) =>
          m._id === id
            ? {
                ...m,
                status,
                startedAt:
                  status === "enroute" && !m.startedAt
                    ? new Date().toISOString()
                    : m.startedAt,
                completedAt:
                  status === "completed" && !m.completedAt
                    ? new Date().toISOString()
                    : m.completedAt,
              }
            : m
        )
      );
      
      // Close dropdown
      setOpenDropdown(null);
      
    } catch (err: any) {
      console.error("❌ Failed to update mission status:", err);
      
      if (err.response?.status === 400) {
        setError("Invalid status transition. Cannot go backwards.");
      } else if (err.response?.status === 404) {
        setError("Mission not found. Refreshing...");
        fetchMissions();
      } else {
        setError("Failed to update status. Please try again.");
      }
    } finally {
      setUpdatingMission(null);
    }
  };

  /* ---------- EMERGENCY NAME ---------- */
  const getEmergencyName = (emergencyId: any) => {
    if (typeof emergencyId === "object" && emergencyId?.type) {
      return emergencyId.type.toUpperCase();
    }
    return emergencyId?.slice(-6) || "Unknown";
  };

  /* ---------- TEAM NAME ---------- */
  const getTeamName = (rescueTeamId: any) => {
    if (typeof rescueTeamId === "object" && rescueTeamId?.fullName) {
      return rescueTeamId.fullName;
    }
    return rescueTeamId?.slice(-6) || "Unknown Team";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            Live Missions
            <div className="text-sm bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">
              Auto-refreshing
            </div>
          </h1>
          <p className="text-cyan-300">
            Click status badge to update mission → Real-time sync
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
              <div className="text-red-300 text-sm">{error}</div>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Missions Container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-white">
              Mission Queue ({sortedMissions.length})
            </h3>
            <Button
              onClick={fetchMissions}
              variant="outline"
              size="sm"
              disabled={loading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mr-3" />
              <span className="text-gray-400">Loading missions...</span>
            </div>
          ) : sortedMissions.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Activity className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <p className="text-xl mb-2">No active missions</p>
              <p className="text-sm">Assigned missions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              {sortedMissions.map((mission) => {
                const isLocked = mission.status === "completed" || mission.status === "cancelled";
                const isUpdating = updatingMission === mission._id;

                return (
                  <div
                    key={mission._id}
                    className="group bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 hover:border-cyan-400/50 rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* LEFT - Mission Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-3 relative">
                          <span className="text-white font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent pr-2">
                            {mission._id.slice(-8)}
                          </span>

                          {/* Status Badge with Dropdown */}
                          <div className="relative">
                            <button
                              disabled={isLocked || isUpdating}
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === mission._id ? null : mission._id
                                )
                              }
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all shadow-lg ${
                                statusStyles[mission.status]
                              } ${
                                isLocked || isUpdating
                                  ? "cursor-not-allowed opacity-70"
                                  : "hover:scale-105 hover:shadow-cyan-400/25 hover:ring-2 ring-transparent"
                              }`}
                            >
                              {statusIcons[mission.status]}
                              <span className="uppercase tracking-wider">
                                {mission.status}
                              </span>
                              {!isLocked && !isUpdating && <ChevronDown size={16} />}
                              {isUpdating && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                            </button>

                            {/* Status Dropdown */}
                            {openDropdown === mission._id && !isLocked && !isUpdating && (
                              <div className="absolute top-12 left-0 z-50 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                {STATUS_ORDER.map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => updateStatus(mission._id, status)}
                                    disabled={isUpdating}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all border-t border-gray-700/50 first:border-t-0 disabled:opacity-50"
                                  >
                                    {statusIcons[status]}
                                    <span className="uppercase tracking-wider font-medium">
                                      {status}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Emergency Info */}
                        <div className="space-y-1 mb-4">
                          <p className="text-white font-semibold text-base">
                            {getEmergencyName(mission.emergencyId)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Team: {getTeamName(mission.rescueTeamId)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Vehicles: {mission.vehiclesAssigned.length || 0}
                          </p>
                        </div>

                        {/* Route Preview */}
                        {mission.route && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900/50 px-3 py-1.5 rounded-lg">
                            <Truck size={12} />
                            <span>Route active</span>
                          </div>
                        )}
                      </div>

                      {/* RIGHT - ETA */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-3xl font-black bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                          {formatETA(mission.eta)}
                        </div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">
                          ETA
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
