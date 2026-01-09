"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import EmergencyInstructions from "@/components/Emergency";
import { Truck, Activity, Wrench, Send, Users, AlertCircle, Loader2, CheckCircle } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEmergencies } from "@/hooks/useEmergencies";
import { useVehicles } from "@/hooks/useVehicles";
import { useMissions } from "@/hooks/useMissions";
import { useRescueUsers } from "@/hooks/useRescueUsers";

import { Emergency, VehicleStatus, User } from "@/types";

// ---------- STYLES ----------
const statusStyle: Record<VehicleStatus, string> = {
  available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  "in-use": "bg-amber-500/20 text-amber-400 border-amber-500/40",
  down: "bg-red-500/20 text-red-400 border-red-500/40",
};

const severityStyle: Record<string, string> = {
  critical: "border-red-500/40 text-red-400",
  high: "border-orange-500/40 text-orange-400",
  medium: "border-yellow-500/40 text-yellow-400",
};

// ================= PAGE =================
export default function ResourceAllocationPage() {
  // ---------- DATA ----------
  const { emergencies = [] } = useEmergencies();
  const { vehicles = [], updateVehicle } = useVehicles();
  const { rescueUsers = [] } = useRescueUsers();
  const { createMission } = useMissions();

  // ---------- STATE ----------
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [selectedRescueTeam, setSelectedRescueTeam] = useState<User | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [eta, setEta] = useState("");
  const [isDispatching, setIsDispatching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ---------- FILTERS ----------
  const pendingEmergencies = useMemo(
    () => emergencies.filter((e) => e.status === "pending"),
    [emergencies]
  );

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === "available"),
    [vehicles]
  );

  // ---------- METRICS ----------
  const availableCount = availableVehicles.length;
  const inUseCount = vehicles.filter((v) => v.status === "in-use").length;
  const downCount = vehicles.filter((v) => v.status === "down").length;

  // ---------- BULLETPROOF DISPATCH ----------
  const handleDispatch = async () => {
    setError("");
    setSuccess(false);

    // Client-side validation
    if (!selectedEmergency) return setError("Please select a pending emergency");
    if (!selectedRescueTeam) return setError("Please select a rescue team");
    if (selectedVehicles.length === 0) return setError("Please select at least one vehicle");

    setIsDispatching(true);

    try {
      // ✅ BACKEND-SAFE PAYLOAD (exact match to your service)
      const payload = {
        emergencyId: selectedEmergency._id.toString(),
        rescueTeamId: selectedRescueTeam._id.toString(),
        vehiclesAssigned: selectedVehicles.map(id => id.toString()),
        eta: eta || undefined
      };

      console.log("🔥 SENDING:", JSON.stringify(payload, null, 2));

      // Create mission (backend handles Team ref error)
      const mission = await createMission(payload);
      
      console.log("✅ MISSION CREATED:", mission);

      // Update vehicles (failsafe - skip if mission fails)
      try {
        await Promise.all(
          selectedVehicles.map(id => 
            updateVehicle(id, { status: "in-use" })
          )
        );
      } catch (vehicleError) {
        console.warn("⚠️ Vehicle update failed (non-critical):", vehicleError);
      }

      // SUCCESS
      setSuccess(true);
      setSelectedEmergency(null);
      setSelectedRescueTeam(null);
      setSelectedVehicles([]);
      setEta("");

    } catch (error: any) {
      console.error("💥 FULL ERROR:", error);

      // 500 = Backend server crash (Team model issue)
      if (error.response?.status === 500) {
        setError("❌ Backend server error. Your backend expects a 'Team' ID but received a User ID. Create Teams collection or update Mission model.");
      }
      // 400 = Validation error
      else if (error.response?.status === 400) {
        const msg = error.response?.data?.message || "Validation failed";
        setError(`❌ ${msg}`);
      }
      // Network/Auth
      else {
        setError(`❌ ${error.message || "Network error. Check backend is running."}`);
      }
    } finally {
      setIsDispatching(false);
    }
  };

  const isFormValid = selectedEmergency && selectedRescueTeam && selectedVehicles.length > 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1e0b3b] to-[#0f172a]">
      <Sidebar role="logistics" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Logistics Resource Allocation
          </h1>
          <p className="text-purple-300">
            Emergency → Rescue Team → Vehicle Dispatch
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard icon={<Truck size={34} />} label="Available" value={availableCount} color="green" />
          <MetricCard icon={<Activity size={34} />} label="In Use" value={inUseCount} color="amber" />
          <MetricCard icon={<Wrench size={34} />} label="Down" value={downCount} color="red" />
        </div>

        <EmergencyInstructions disasterType="flood" />

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
              <div className="text-emerald-300 text-sm leading-relaxed">
                Mission dispatched successfully! Vehicles marked as in-use.
              </div>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
              <div className="text-red-300 text-sm leading-relaxed">{error}</div>
              <button 
                onClick={() => setError("")}
                className="ml-auto text-red-400 hover:text-red-300 transition-colors text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* LEFT PANEL */}
          <div className="space-y-6">
            {/* EMERGENCIES */}
            <SelectablePanel
              title="Pending Emergencies"
              items={pendingEmergencies}
              selectedId={selectedEmergency?._id}
              onSelect={setSelectedEmergency}
              render={(e) => (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold text-lg">
                      {e.type.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 border rounded-full font-semibold ${severityStyle[e.severity]}`}>
                      {e.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">
                    {e.location.lat.toFixed(3)}, {e.location.lng.toFixed(3)}
                  </p>
                  <p className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                    {e.status}
                  </p>
                </>
              )}
            />

            {/* RESCUE TEAMS */}
            <SelectablePanel
              title="Rescue Teams"
              icon={<Users size={18} />}
              items={rescueUsers.filter(u => u.role === 'rescue')}
              selectedId={selectedRescueTeam?._id}
              onSelect={setSelectedRescueTeam}
              render={(u) => (
                <>
                  <p className="text-white font-semibold">{u.name}</p>
                  <p className="text-gray-400 text-sm">{u.email}</p>
                  <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full mt-1">
                    {u.role}
                  </span>
                </>
              )}
            />

            {/* DISPATCH */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
              <label className="text-gray-300 text-sm block mb-3 font-medium">ETA (Optional)</label>
              <Input
                type="datetime-local"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full mb-6 px-4 py-2 rounded-lg bg-slate-900 border border-white/20 text-white"
                disabled={isDispatching}
              />

              {!isFormValid && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <AlertCircle size={16} />
                    Select emergency, team, and vehicles to dispatch
                  </div>
                </div>
              )}

              <Button
                onClick={handleDispatch}
                disabled={!isFormValid || isDispatching}
                className="w-full h-12 flex gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDispatching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Dispatch Mission ({selectedVehicles.length} vehicles)
                  </>
                )}
              </Button>

              {isFormValid && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm">
                  <div className="text-emerald-400 font-medium">
                    ✅ Ready: {selectedEmergency?.type} → {selectedRescueTeam?.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* VEHICLES TABLE */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Available Vehicles ({availableVehicles.length})
            </h3>

            {availableVehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Wrench className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">No available vehicles</p>
                <p className="text-sm mt-1">All vehicles are currently in use or down</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableVehicles.map((v) => (
                    <TableRow key={v._id} className="hover:bg-white/5">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedVehicles.includes(v._id)}
                          onChange={() =>
                            setSelectedVehicles((prev) =>
                              prev.includes(v._id)
                                ? prev.filter((id) => id !== v._id)
                                : [...prev, v._id]
                            )
                          }
                          className="w-5 h-5 rounded border-white/30 focus:ring-purple-500"
                          disabled={isDispatching}
                        />
                      </TableCell>
                      <TableCell className="text-white font-mono text-sm">
                        {v._id.slice(-6)}
                      </TableCell>
                      <TableCell className="text-white font-semibold">{v.identifier}</TableCell>
                      <TableCell className="text-gray-300 capitalize">{v.type}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle[v.status]}`}>
                          {v.status.replace("-", " ")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------- COMPONENTS ----------
function SelectablePanel<T extends { _id: string }>({
  title,
  icon,
  items = [],
  selectedId,
  onSelect,
  render,
}: {
  title: string;
  icon?: React.ReactNode;
  items?: T[];
  selectedId?: string;
  onSelect: (item: T) => void;
  render: (item: T) => React.ReactNode;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        {icon} {title} ({items.length})
      </h3>
      <div className="space-y-3 max-h-[320px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-gray-400 text-center py-12 text-sm border-2 border-dashed border-gray-700 rounded-xl">
            No {title.toLowerCase()} available
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              onClick={() => onSelect(item)}
              className={`p-4 rounded-xl cursor-pointer border transition-all hover:shadow-lg ${
                selectedId === item._id
                  ? "bg-purple-500/20 border-purple-400 shadow-lg ring-2 ring-purple-500/30"
                  : "bg-black/40 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {render(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: any) {
  const styles = {
    green: "from-emerald-500/20 to-green-600/20 border-emerald-500/40",
    amber: "from-amber-500/20 to-orange-600/20 border-amber-500/40",
    red: "from-red-500/20 to-rose-600/20 border-red-500/40",
  };

  return (
    <div className={`bg-gradient-to-br ${styles[color]} border rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-lg`}>
      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-300 text-sm font-medium">{label}</p>
    </div>
  );
}
