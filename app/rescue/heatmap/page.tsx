"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Users, X, Navigation } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

/* ===================== TYPES ===================== */
interface Victim {
  id: string;
  lat: number;
  lng: number;
  name: string;
  severity: "critical" | "high" | "medium" | "low";
  status: string;
  timestamp: string;
}

interface Cluster {
  id: string;
  lat: number;
  lng: number;
  victims: Victim[];
  severity: "critical" | "high" | "medium" | "low";
  count: number;
  avgDistance: number;
}

/* ===================== MOCK DATA ===================== */
const MOCK_VICTIMS: Victim[] = [
  { id: "V-001", lat: 28.6139, lng: 77.209, name: "John Doe", severity: "critical", status: "Waiting for rescue", timestamp: "2 min ago" },
  { id: "V-002", lat: 28.6145, lng: 77.2095, name: "Jane Smith", severity: "critical", status: "Waiting for rescue", timestamp: "5 min ago" },
  { id: "V-003", lat: 28.615, lng: 77.2098, name: "Mike Johnson", severity: "high", status: "Stable", timestamp: "8 min ago" },
  { id: "V-004", lat: 28.6135, lng: 77.2088, name: "Sarah Williams", severity: "high", status: "Waiting for rescue", timestamp: "3 min ago" },
  { id: "V-005", lat: 28.62, lng: 77.215, name: "Robert Brown", severity: "medium", status: "Stable", timestamp: "10 min ago" },
  { id: "V-006", lat: 28.6205, lng: 77.2155, name: "Emily Davis", severity: "medium", status: "Stable", timestamp: "12 min ago" },
  { id: "V-007", lat: 28.625, lng: 77.22, name: "David Miller", severity: "low", status: "Minor injuries", timestamp: "15 min ago" },
  { id: "V-008", lat: 28.6255, lng: 77.2205, name: "Lisa Anderson", severity: "low", status: "Minor injuries", timestamp: "18 min ago" },
];

/* ===================== HELPERS ===================== */
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const clusterVictims = (victims: Victim[], radiusKm = 0.3): Cluster[] => {
  const clusters: Cluster[] = [];
  const visited = new Set<string>();

  victims.forEach((v) => {
    if (visited.has(v.id)) return;

    const group = victims.filter(
      (x) =>
        !visited.has(x.id) &&
        calculateDistance(v.lat, v.lng, x.lat, x.lng) <= radiusKm
    );

    group.forEach((x) => visited.add(x.id));

    const lat = group.reduce((s, g) => s + g.lat, 0) / group.length;
    const lng = group.reduce((s, g) => s + g.lng, 0) / group.length;

    const severity =
      ["critical", "high", "medium", "low"].find((s) =>
        group.some((g) => g.severity === s)
      ) || "low";

    clusters.push({
      id: `C-${clusters.length + 1}`,
      lat,
      lng,
      victims: group,
      severity: severity as any,
      count: group.length,
      avgDistance: 0,
    });
  });

  return clusters;
};

/* ===================== COMPONENT ===================== */
export default function VictimHeatmap() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  const clusters = useMemo(() => clusterVictims(MOCK_VICTIMS), []);

  useMemo(() => {
    const id = searchParams.get("clusterId");
    if (id) {
      const found = clusters.find((c) => c.id === id);
      if (found) setSelectedCluster(found);
    }
  }, [searchParams, clusters]);

  const colors = (s: string) =>
    s === "critical"
      ? "bg-red-500"
      : s === "high"
      ? "bg-orange-500"
      : s === "medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Crowd Analysis
          </h1>
          <p className="text-cyan-300">
            Live heatmap-based rescue intelligence
          </p>
        </div>

        {/* Heatmap */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="relative h-[450px] rounded-xl border border-white/10 bg-slate-950 overflow-hidden">

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px, 40px 40px, 200px 200px, 200px 200px",
              }}
            />

            {/* Clusters */}
            {clusters.map((c) => {
              const x = 20 + Math.random() * 60;
              const y = 20 + Math.random() * 60;

              return (
                <motion.button
                  key={c.id}
                  onClick={() => setSelectedCluster(c)}
                  whileHover={{ scale: 1.15 }}
                  className={`${colors(
                    c.severity
                  )} absolute w-12 h-12 rounded-full text-white font-bold flex items-center justify-center shadow-lg z-10`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {c.count}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-cyan-400" />
            Cluster Overview
          </h3>

          <div className="space-y-3">
            {clusters.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCluster(c)}
                className="w-full bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-gray-700 rounded-xl p-4 flex justify-between items-center hover:border-cyan-500/50 transition-all"
              >
                <div>
                  <p className="text-white font-semibold">{c.id}</p>
                  <p className="text-gray-400 text-sm">
                    {c.count} victims • {c.severity}
                  </p>
                </div>
                <Users className="text-cyan-400" />
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedCluster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-xl p-6 relative"
            >
              <button
                onClick={() => setSelectedCluster(null)}
                className="absolute top-4 right-4 text-gray-400"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-white mb-2">
                Cluster {selectedCluster.id}
              </h3>
              <p className="text-gray-400 mb-4">
                {selectedCluster.count} victims • {selectedCluster.severity}
              </p>

              <div className="space-y-3 mb-6">
                {selectedCluster.victims.map((v) => (
                  <div
                    key={v.id}
                    className="border border-white/10 rounded-lg p-3"
                  >
                    <p className="text-white font-medium">{v.name}</p>
                    <p className="text-xs text-gray-400">
                      {v.status} • {v.timestamp}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/rescue/mapRoute?lat=${selectedCluster.lat}&lng=${selectedCluster.lng}&victims=${selectedCluster.count}&clusterId=${selectedCluster.id}`
                  )
                }
                className="w-full bg-cyan-500 text-slate-900 rounded-lg py-2 font-semibold flex items-center justify-center gap-2"
              >
                <Navigation size={16} />
                Navigate
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
