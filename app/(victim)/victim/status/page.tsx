"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Droplets,
  Flame,
  PersonStanding,
  Stethoscope,
  MapPin,
  Users,
  ArrowLeft,
  Loader2,
  Clock,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import apiClient from "@/lib/api/client";

/* ---------- Types (Backend-synced) ---------- */
type EmergencyType = "flood" | "fire" | "trapped" | "medical" | "other";
type Severity = "critical" | "high" | "medium";
type Status = "pending" | "assigned" | "resolved";

interface EmergencyRequest {
  _id: string;
  type: EmergencyType;
  description?: string;
  location: { lat: number; lng: number };
  severity: Severity;
  status: Status;
  assignedMissionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ---------- UI Config ---------- */
const emergencyConfig: Record<
  EmergencyType,
  { label: string; icon: any; color: string }
> = {
  flood: { label: "Flood", icon: Droplets, color: "text-blue-400" },
  fire: { label: "Fire", icon: Flame, color: "text-orange-400" },
  trapped: { label: "Trapped", icon: PersonStanding, color: "text-yellow-400" },
  medical: { label: "Medical", icon: Stethoscope, color: "text-red-400" },
  other: { label: "Other", icon: AlertTriangle, color: "text-gray-300" },
};

const severityStyle: Record<Severity, string> = {
  critical: "bg-red-500/20 text-red-300 border-red-400",
  high: "bg-orange-500/20 text-orange-300 border-orange-400",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-400",
};

const statusStyle: Record<Status, string> = {
  pending: "bg-gray-500/20 text-gray-300 border-gray-400",
  assigned: "bg-blue-500/20 text-blue-300 border-blue-400",
  resolved: "bg-green-500/20 text-green-300 border-green-400",
};

/* ---------- Page ---------- */
export default function MyRequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/emergencies/my");

      const list = Array.isArray(res.data?.emergencies)
        ? res.data.emergencies
        : [];

      setRequests(list);
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <Sidebar role="victim" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Sidebar role="victim" />

      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/victim/dashboard"
            className="text-gray-300 flex items-center gap-2 mb-4 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <h1 className="text-4xl font-extrabold text-white">
            My Emergency Requests
          </h1>
          <p className="text-gray-400 mt-1 text-lg">
            Real-time status of your reported emergencies
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Empty */}
        {requests.length === 0 && !error && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">
              No Emergency Reports
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't reported any emergencies yet.
            </p>
            <Link
              href="/victim/report"
              className="inline-block px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
            >
              Report Emergency
            </Link>
          </div>
        )}

        {/* List */}
        <div className="space-y-6">
          {requests.map((req) => {
            const meta = emergencyConfig[req.type];
            const Icon = meta.icon;

            return (
              <div
                key={req._id}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <Icon className={`w-7 h-7 ${meta.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {meta.label} Emergency
                        </p>
                        <p className="text-sm text-gray-400 flex gap-2 items-center">
                          <Clock className="w-4 h-4" />
                          {formatDate(req.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={`border px-3 py-1 rounded-full text-sm font-semibold ${severityStyle[req.severity]}`}
                      >
                        {req.severity.toUpperCase()}
                      </span>
                      <span
                        className={`border px-3 py-1 rounded-full text-sm font-semibold ${statusStyle[req.status]}`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-gray-400">Situation</span>
                      <span className="col-span-2 text-white font-semibold">
                        {req.description || "No description provided"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-gray-400 flex gap-2 items-center">
                        <MapPin className="w-4 h-4" /> Location
                      </span>
                      <span className="col-span-2 text-white font-mono">
                        {req.location.lat.toFixed(4)},{" "}
                        {req.location.lng.toFixed(4)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-gray-400 flex gap-2 items-center">
                        <Users className="w-4 h-4" /> People
                      </span>
                      <span className="col-span-2 text-white font-bold">
                        Multiple people
                      </span>
                    </div>
                  </div>
                </div>

                {req.status === "pending" && (
                  <div className="bg-yellow-500/20 border-t border-yellow-500/40 px-6 py-3">
                    ⏳ Request received. Processing…
                  </div>
                )}
                {req.status === "assigned" && (
                  <div className="bg-blue-500/20 border-t border-blue-500/40 px-6 py-3">
                    🚑 Rescue team assigned and responding
                  </div>
                )}
                {req.status === "resolved" && (
                  <div className="bg-green-500/20 border-t border-green-500/40 px-6 py-3">
                    ✅ Emergency resolved successfully
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
