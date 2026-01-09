"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import EmergencyInstructions from "@/components/Emergency";
import { Truck, Wrench, Activity, Plus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useVehicles } from "@/hooks/useVehicles";
import { Vehicle, VehicleStatus, VehicleType } from "@/types";

/* ---------- STATUS STYLE ---------- */
const statusStyle: Record<VehicleStatus, string> = {
  available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  "in-use": "bg-amber-500/20 text-amber-400 border-amber-500/40",
  down: "bg-red-500/20 text-red-400 border-red-500/40",
};

export default function VehicleAllocationPage() {
  const {
    vehicles,
    createVehicle,
    updateVehicle,
  } = useVehicles();

  /* ---------- CREATE FORM ---------- */
  const [identifier, setIdentifier] = useState("");
  const [type, setType] = useState<VehicleType>("ambulance");

  const handleCreateVehicle = async () => {
    if (!identifier) return;

    await createVehicle({
      identifier,
      type,
      location: { lat: 0, lng: 0 }, // backend-required
    });

    setIdentifier("");
  };

  /* ---------- METRICS ---------- */
  const available = vehicles.filter(v => v.status === "available").length;
  const inUse = vehicles.filter(v => v.status === "in-use").length;
  const down = vehicles.filter(v => v.status === "down").length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1e0b3b] to-[#0f172a]">
      <Sidebar role="logistics" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Vehicle Allocation & Routing
          </h1>
          <p className="text-purple-300">
            Live Fleet Status • Dispatch • Maintenance
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard icon={<Truck size={34} />} label="Available" value={available} color="green" />
          <MetricCard icon={<Activity size={34} />} label="In Use" value={inUse} color="amber" />
          <MetricCard icon={<Wrench size={34} />} label="Down / Maintenance" value={down} color="red" />
        </div>

        {/* EMERGENCY INSTRUCTIONS */}
        <div className="mb-8">
          <EmergencyInstructions disasterType="flood" />
        </div>

        {/* CREATE VEHICLE */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Plus /> Register New Vehicle
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Vehicle Identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value as VehicleType)}
              className="bg-slate-900 text-white border border-white/20 rounded-md px-4 py-2"
            >
              <option value="ambulance">Ambulance</option>
              <option value="boat">Boat</option>
              <option value="helicopter">Helicopter</option>
              <option value="truck">Truck</option>
            </select>

            <Button onClick={handleCreateVehicle}>Add Vehicle</Button>
          </div>
        </div>

        {/* VEHICLE TABLE */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Vehicle Registry
          </h3>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10">
                  <TableHead>ID</TableHead>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mission</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v._id} className="hover:bg-purple-500/10">
                    <TableCell className="text-white">{v._id.slice(-5)}</TableCell>
                    <TableCell className="text-white">{v.identifier}</TableCell>
                    <TableCell className="text-gray-300">{v.type}</TableCell>

                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle[v.status]}`}>
                        {v.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-gray-400">
                      {v.assignedMissionId ? "Assigned" : "—"}
                    </TableCell>

                    <TableCell>
                      <select
                        value={v.status}
                        onChange={(e) =>
                          updateVehicle(v._id, {
                            status: e.target.value as VehicleStatus,
                          })
                        }
                        className="bg-slate-900 text-white border border-white/20 rounded-md px-3 py-1"
                      >
                        <option value="available">Available</option>
                        <option value="in-use">In Use</option>
                        <option value="down">Down</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- METRIC CARD ---------- */
function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "green" | "amber" | "red";
}) {
  const styles = {
    green: "from-emerald-500/20 to-green-600/20 border-emerald-500/40",
    amber: "from-amber-500/20 to-orange-600/20 border-amber-500/40",
    red: "from-red-500/20 to-rose-600/20 border-red-500/40",
  };

  return (
    <div className={`bg-gradient-to-br ${styles[color]} border rounded-2xl p-6`}>
      <div className="mb-3">{icon}</div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}
