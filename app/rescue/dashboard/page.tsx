"use client";

import { use, useState } from "react";
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  Line,
} from "recharts";

/* ---------- Mock Data ---------- */
const missionTrend = [
  { time: "6AM", active: 8, completed: 12, urgent: 3 },
  { time: "9AM", active: 15, completed: 18, urgent: 7 },
  { time: "12PM", active: 22, completed: 25, urgent: 10 },
  { time: "3PM", active: 18, completed: 32, urgent: 6 },
  { time: "6PM", active: 12, completed: 38, urgent: 4 },
];

const responseTime = [
  { hour: "8AM", avgTime: 12 },
  { hour: "10AM", avgTime: 9 },
  { hour: "12PM", avgTime: 11 },
  { hour: "2PM", avgTime: 8 },
  { hour: "4PM", avgTime: 10 },
  { hour: "6PM", avgTime: 7 },
];

const priorityDistribution = [
  { name: "Critical", value: 15, color: "#ef4444" },
  { name: "High", value: 28, color: "#f97316" },
  { name: "Medium", value: 35, color: "#eab308" },
  { name: "Low", value: 22, color: "#22c55e" },
];

const activeMissions = [
  {
    id: "M-1028",
    type: "Flood Rescue",
    location: "Sector 12",
    priority: "Critical",
    eta: "6 min",
  },
  {
    id: "M-1029",
    type: "Medical Emergency",
    location: "Old Town",
    priority: "High",
    eta: "11 min",
  },
  {
    id: "M-1030",
    type: "Fire Rescue",
    location: "Mall Road",
    priority: "Critical",
    eta: "4 min",
  },
];
import {useLiveLocation} from "@/hooks/useLiveLocation";

export default function RescueDashboard() {
  const [teamName] = useState("Alpha Team");
  useLiveLocation();
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      {/* ---------- Sidebar ---------- */}
      <Sidebar role="rescue" />

      {/* ---------- Main Content ---------- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Command Center – {teamName}
          </h1>
          <p className="text-cyan-300">Live Operations Dashboard</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<Zap size={36} />}
            value="5"
            label="Active Missions"
            color="cyan"
          />
          <MetricCard
            icon={<AlertTriangle size={36} />}
            value="7"
            label="High Risk Alerts"
            color="red"
          />
          <MetricCard
            icon={<CheckCircle size={36} />}
            value="38"
            label="Completed Today"
            color="green"
          />
          <MetricCard
            icon={<TrendingUp size={36} />}
            value="11m"
            label="Average ETA"
            color="purple"
          />
        </div>

        {/* Mission Trend & Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Mission Activity */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Mission Activity Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={missionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="urgent"
                  stroke="#ef4444"
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Priority Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(e) => `${e.value}%`}
                >
                  {priorityDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Response Time Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={responseTime}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis
                stroke="#9ca3af"
                label={{
                  value: "Minutes",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9ca3af",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="avgTime"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#colorTime)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active Missions */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Active Mission Queue
          </h3>

          <div className="space-y-4">
            {activeMissions.map((m) => (
              <div
                key={m.id}
                className="bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-gray-700 rounded-xl p-5 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-semibold text-lg">
                        {m.id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          m.priority === "Critical"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                        }`}
                      >
                        {m.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {m.type} • {m.location}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">
                      {m.eta}
                    </p>
                    <p className="text-gray-500 text-xs">ETA</p>
                  </div>
                </div>
              </div>
            ))}
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
  color: "cyan" | "red" | "green" | "purple";
}) {
  const styles = {
    cyan: "from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-400",
    red: "from-red-500/20 to-orange-600/20 border-red-500/40 text-red-400",
    green:
      "from-green-500/20 to-emerald-600/20 border-green-500/40 text-green-400",
    purple:
      "from-purple-500/20 to-pink-600/20 border-purple-500/40 text-purple-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${styles[color]} border rounded-2xl p-6 relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      <div className="mb-3">{icon}</div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}
