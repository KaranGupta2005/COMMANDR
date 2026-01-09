"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Cpu, Truck, Activity, BarChart3 } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
} from "recharts";
import { useLiveLocation } from "@/hooks/useLiveLocation";

/* ---------- Mock Data ---------- */
const vehicleUtilization = [
  { hour: "00:00", ambulance: 45, boat: 20, helicopter: 10, truck: 35 },
  { hour: "04:00", ambulance: 30, boat: 15, helicopter: 5, truck: 25 },
  { hour: "08:00", ambulance: 75, boat: 40, helicopter: 25, truck: 60 },
  { hour: "12:00", ambulance: 85, boat: 55, helicopter: 35, truck: 70 },
  { hour: "16:00", ambulance: 80, boat: 50, helicopter: 30, truck: 65 },
  { hour: "20:00", ambulance: 60, boat: 35, helicopter: 20, truck: 45 },
];

const systemPerformance = [
  { metric: "Response Time", score: 88, target: 95 },
  { metric: "Resource Allocation", score: 92, target: 90 },
  { metric: "Coverage Area", score: 85, target: 95 },
  { metric: "Team Efficiency", score: 90, target: 85 },
  { metric: "Communication", score: 87, target: 90 },
  { metric: "Predictive Accuracy", score: 91, target: 85 },
];

const resourceScatter = [
  { location: "Zone A", vehicles: 12, utilization: 85, impact: 400 },
  { location: "Zone B", vehicles: 8, utilization: 65, impact: 250 },
  { location: "Zone C", vehicles: 15, utilization: 90, impact: 500 },
  { location: "Zone D", vehicles: 6, utilization: 55, impact: 180 },
  { location: "Zone E", vehicles: 10, utilization: 75, impact: 320 },
];

const predictionTrend = [
  { day: "Mon", predicted: 45, actual: 42 },
  { day: "Tue", predicted: 52, actual: 50 },
  { day: "Wed", predicted: 48, actual: 51 },
  { day: "Thu", predicted: 55, actual: 53 },
  { day: "Fri", predicted: 60, actual: 58 },
  { day: "Sat", predicted: 50, actual: 0 },
  { day: "Sun", predicted: 45, actual: 0 },
];

const fleetStatus = [
  { type: "Ambulance", total: 24, active: 18, available: 6, maintenance: 0 },
  { type: "Boat", total: 12, active: 8, available: 3, maintenance: 1 },
  { type: "Helicopter", total: 6, active: 3, available: 2, maintenance: 1 },
  { type: "Truck", total: 18, active: 12, available: 5, maintenance: 1 },
];

export default function LogisticsDashboard() {
  const [commandCenter] = useState("Central Command");
  useLiveLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1e0b3b] to-[#0f172a]">
      {/* ---------- Sidebar ---------- */}
      <Sidebar role="logistics" />

      {/* ---------- Main Content ---------- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {commandCenter} – Strategic Overview
          </h1>
          <p className="text-purple-300">
            System-Wide Intelligence & Optimization
          </p>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard icon={<Truck size={36} />} value="18" label="Vehicles Deployed" color="violet" />
          <MetricCard icon={<Activity size={36} />} value="81%" label="Resource Utilization" color="blue" />
          <MetricCard icon={<BarChart3 size={36} />} value="92%" label="System Efficiency" color="green" />
          <MetricCard icon={<Cpu size={36} />} value="4" label="Simulations Ready" color="amber" />
        </div>

        {/* Utilization & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fleet Utilization */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Fleet Utilization (24h)
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={vehicleUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="ambulance" stackId="a" fill="#3b82f6" />
                <Bar dataKey="boat" stackId="a" fill="#06b6d4" />
                <Bar dataKey="helicopter" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="truck" stackId="a" fill="#10b981" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Radar */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              System Performance
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={systemPerformance}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                <PolarRadiusAxis stroke="#9ca3af" />
                <Radar dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Radar dataKey="target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter & Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Resource Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="vehicles" type="number" stroke="#9ca3af" />
                <YAxis dataKey="utilization" type="number" stroke="#9ca3af" />
                <ZAxis dataKey="impact" range={[100, 1000]} />
                <Tooltip />
                <Scatter data={resourceScatter} fill="#f59e0b" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              AI Prediction Accuracy
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Line dataKey="predicted" stroke="#a855f7" strokeDasharray="5 5" strokeWidth={3} />
                <Line dataKey="actual" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Live Fleet Status
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left p-4">Vehicle</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Active</th>
                  <th className="text-center">Available</th>
                  <th className="text-center">Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {fleetStatus.map((f) => (
                  <tr key={f.type} className="border-b border-white/5 text-gray-300">
                    <td className="p-4 text-white font-medium">{f.type}</td>
                    <td className="text-center">{f.total}</td>
                    <td className="text-center text-blue-400">{f.active}</td>
                    <td className="text-center text-green-400">{f.available}</td>
                    <td className="text-center text-amber-400">{f.maintenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Metric Card ---------- */
function MetricCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: "violet" | "blue" | "green" | "amber";
}) {
  const styles = {
    violet: "from-violet-500/20 to-purple-600/20 border-violet-500/40 text-violet-400",
    blue: "from-blue-500/20 to-cyan-600/20 border-blue-500/40 text-blue-400",
    green: "from-emerald-500/20 to-green-600/20 border-emerald-500/40 text-emerald-400",
    amber: "from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-400",
  };

  return (
    <div className={`bg-gradient-to-br ${styles[color]} border rounded-2xl p-6 relative`}>
      <div className="mb-3">{icon}</div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}
