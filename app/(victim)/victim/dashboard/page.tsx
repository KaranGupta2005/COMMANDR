"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, MapPin, Users, Clock, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import apiClient from "@/lib/api/client";
import { useLiveLocation } from "@/hooks/useLiveLocation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

/* ---------- TYPES ---------- */
interface Emergency {
  _id: string;
  status: "pending" | "assigned" | "resolved";
  createdAt: string;
  updatedAt: string;
}

interface SafeZone {
  _id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
}

export default function VictimDashboard() {
  const [userName, setUserName] = useState("User");
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [loading, setLoading] = useState(true);

  useLiveLocation();

  /* ---------- FETCH ---------- */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [meRes, emergencyRes, safeZoneRes] = await Promise.all([
          apiClient.get("/auth/me"),
          apiClient.get("/emergencies/my"),
          apiClient.get("/safezones"),
        ]);

        setUserName(meRes.data.user.fullName);
        setEmergencies(emergencyRes.data.emergencies || []);
        setSafeZones(safeZoneRes.data.data || []);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ---------- DERIVED STATS ---------- */
  const stats = useMemo(() => {
    const active = emergencies.filter(
      (e) => e.status === "pending" || e.status === "assigned"
    );

    const resolved = emergencies.filter((e) => e.status === "resolved");

    const avgResponseMs =
      resolved.reduce((sum, e) => {
        return (
          sum +
          (new Date(e.updatedAt).getTime() -
            new Date(e.createdAt).getTime())
        );
      }, 0) / (resolved.length || 1);

    return {
      activeRequests: active.length,
      nearbySafeZones: safeZones.length,
      peopleHelped: resolved.length,
      avgResponseTime: `${Math.round(avgResponseMs / 60000)}m`,
    };
  }, [emergencies, safeZones]);

  /* ---------- CHART DATA ---------- */
  const requestHistory = useMemo(() => {
    const map = new Map<string, number>();

    emergencies.forEach((e) => {
      const date = new Date(e.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
      map.set(date, (map.get(date) || 0) + 1);
    });

    return [...map.entries()].map(([date, requests]) => ({
      date,
      requests,
    }));
  }, [emergencies]);

  const helpMetrics = [
    { category: "Response Time", value: Math.min(100, 90) },
    { category: "Safety", value: 92 },
    { category: "Communication", value: 80 },
    { category: "Resources", value: 78 },
    { category: "Coordination", value: 85 },
  ];

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
        <Sidebar role="victim" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      <Sidebar role="victim" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {userName}
          </h1>
          <p className="text-gray-400">Your safety is our priority</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<AlertCircle />} value={stats.activeRequests} label="Active Requests" color="blue" />
          <StatCard icon={<MapPin />} value={stats.nearbySafeZones} label="Safe Zones" color="green" />
          <StatCard icon={<Users />} value={stats.peopleHelped} label="People Helped" color="purple" />
          <StatCard icon={<Clock />} value={stats.avgResponseTime} label="Avg Response" color="orange" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Your Emergency Reports
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={requestHistory}>
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="requests" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              System Performance
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={helpMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis />
                <Radar dataKey="value" fill="#10b981" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safe Zones */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Safe Zones
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safeZones.map((zone) => {
              const available = zone.capacity - zone.currentOccupancy;
              const percent = Math.round(
                (zone.currentOccupancy / zone.capacity) * 100
              );

              return (
                <div
                  key={zone._id}
                  className="bg-black/40 border border-white/10 rounded-xl p-5"
                >
                  <h4 className="text-white font-semibold mb-2">{zone.name}</h4>
                  <p className="text-sm text-gray-400">
                    Available:{" "}
                    <span className="text-green-400 font-semibold">
                      {available}
                    </span>
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      percent > 90
                        ? "text-red-400"
                        : percent > 70
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    Occupancy: {percent}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-gray-300">
                Your reports trigger real-time rescue operations.
              </p>
            </div>

            <Link
              href="/victim/report"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Report Emergency
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- STAT CARD ---------- */
function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colors = {
    blue: "border-blue-500/30 text-blue-400",
    green: "border-green-500/30 text-green-400",
    purple: "border-purple-500/30 text-purple-400",
    orange: "border-orange-500/30 text-orange-400",
  };

  return (
    <div className={`bg-white/5 border ${colors[color]} rounded-2xl p-6`}>
      <div className="flex justify-between items-center mb-3">
        {icon}
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}
