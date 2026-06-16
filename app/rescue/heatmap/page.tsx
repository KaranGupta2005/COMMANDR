"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Users, X, Navigation, Flame, Droplets, AlertTriangle,
  Activity, TrendingUp, Clock, Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
  BarChart, Bar, Legend,
  AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import apiClient from "@/lib/api/client";

/* ===================== TYPES ===================== */
interface Emergency {
  _id: string;
  type: string;
  severity: "critical" | "high" | "medium";
  location: { lat: number; lng: number };
  status: string;
  createdAt: string;
}

interface GridCell {
  x: number;
  y: number;
  zone: string;
  density: number;
  critical: number;
  high: number;
  medium: number;
  total: number;
}

/* ===================== GRID HEATMAP HELPERS ===================== */
const GRID_SIZE = 8; // 8x8 grid
const SEVERITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
};

const ZONE_NAMES = [
  "Alpha", "Bravo", "Charlie", "Delta",
  "Echo", "Foxtrot", "Golf", "Hotel",
];

function buildHeatGrid(emergencies: Emergency[]): GridCell[] {
  if (!emergencies.length) return generateMockGrid();

  // Find bounds
  const lats = emergencies.map((e) => e.location.lat);
  const lngs = emergencies.map((e) => e.location.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;

  const grid: GridCell[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cellMinLat = minLat + (row / GRID_SIZE) * latRange;
      const cellMaxLat = minLat + ((row + 1) / GRID_SIZE) * latRange;
      const cellMinLng = minLng + (col / GRID_SIZE) * lngRange;
      const cellMaxLng = minLng + ((col + 1) / GRID_SIZE) * lngRange;

      const inCell = emergencies.filter(
        (e) =>
          e.location.lat >= cellMinLat && e.location.lat < cellMaxLat &&
          e.location.lng >= cellMinLng && e.location.lng < cellMaxLng
      );

      grid.push({
        x: col,
        y: row,
        zone: `${ZONE_NAMES[row % 8]}-${col + 1}`,
        density: inCell.length,
        critical: inCell.filter((e) => e.severity === "critical").length,
        high: inCell.filter((e) => e.severity === "high").length,
        medium: inCell.filter((e) => e.severity === "medium").length,
        total: inCell.length,
      });
    }
  }
  return grid;
}

function generateMockGrid(): GridCell[] {
  const grid: GridCell[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const critical = Math.floor(Math.random() * 4);
      const high = Math.floor(Math.random() * 6);
      const medium = Math.floor(Math.random() * 8);
      grid.push({
        x: col, y: row,
        zone: `${ZONE_NAMES[row % 8]}-${col + 1}`,
        density: critical * 3 + high * 2 + medium,
        critical, high, medium,
        total: critical + high + medium,
      });
    }
  }
  return grid;
}

function getTimeDistribution(emergencies: Emergency[]) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    critical: 0, high: 0, medium: 0,
  }));

  if (!emergencies.length) {
    // Mock data
    return hours.map((h, i) => ({
      ...h,
      critical: Math.floor(Math.sin(i / 4) * 3 + 3),
      high: Math.floor(Math.cos(i / 3) * 4 + 5),
      medium: Math.floor(Math.sin(i / 2) * 3 + 4),
    }));
  }

  emergencies.forEach((e) => {
    const h = new Date(e.createdAt).getHours();
    if (e.severity === "critical") hours[h].critical++;
    else if (e.severity === "high") hours[h].high++;
    else hours[h].medium++;
  });
  return hours;
}

function getTypeDistribution(emergencies: Emergency[]) {
  const types = ["flood", "fire", "trapped", "medical", "other"];
  if (!emergencies.length) {
    return types.map((t) => ({
      type: t, count: Math.floor(Math.random() * 15 + 3),
    }));
  }
  return types.map((t) => ({
    type: t,
    count: emergencies.filter((e) => e.type === t).length,
  }));
}

function getZoneRiskRadar(grid: GridCell[]) {
  const zones = ZONE_NAMES.slice(0, GRID_SIZE);
  return zones.map((zone, i) => {
    const row = grid.filter((c) => c.y === i);
    return {
      zone,
      density: row.reduce((s, c) => s + c.total, 0),
      critical: row.reduce((s, c) => s + c.critical, 0),
      risk: row.reduce((s, c) => s + c.critical * 3 + c.high * 2 + c.medium, 0),
    };
  });
}

/* ===================== CUSTOM TOOLTIP ===================== */
function HeatCellTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-900 border border-white/20 rounded-lg p-3 shadow-xl">
      <p className="text-white font-bold text-sm">{d.zone}</p>
      <p className="text-gray-400 text-xs mt-1">Grid [{d.x}, {d.y}]</p>
      <div className="mt-2 space-y-1 text-xs">
        <p className="text-red-400">Critical: {d.critical}</p>
        <p className="text-orange-400">High: {d.high}</p>
        <p className="text-yellow-400">Medium: {d.medium}</p>
        <p className="text-white font-semibold mt-1">Total: {d.total}</p>
      </div>
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */
export default function VictimHeatmap() {
  const router = useRouter();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<GridCell | null>(null);

  useEffect(() => {
    apiClient
      .get("/emergencies")
      .then((res) => setEmergencies(res.data.emergencies || []))
      .catch(() => setEmergencies([]))
      .finally(() => setLoading(false));
  }, []);

  const grid = useMemo(() => buildHeatGrid(emergencies), [emergencies]);
  const timeData = useMemo(() => getTimeDistribution(emergencies), [emergencies]);
  const typeData = useMemo(() => getTypeDistribution(emergencies), [emergencies]);
  const radarData = useMemo(() => getZoneRiskRadar(grid), [grid]);

  const hotZones = useMemo(
    () => [...grid].sort((a, b) => b.density - a.density).slice(0, 5),
    [grid]
  );

  const totalEmergencies = emergencies.length || grid.reduce((s, c) => s + c.total, 0);
  const criticalCount = emergencies.filter((e) => e.severity === "critical").length ||
    grid.reduce((s, c) => s + c.critical, 0);

  function getDensityColor(density: number): string {
    if (density === 0) return "#1e293b";
    if (density <= 2) return "#065f46";
    if (density <= 5) return "#a16207";
    if (density <= 8) return "#c2410c";
    return "#dc2626";
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Activity className="text-cyan-400" />
              Emergency Heatmap
            </h1>
            <p className="text-cyan-300">
              Grid-based density analysis • Real-time severity mapping
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-2">
              <p className="text-red-400 text-xs">Critical</p>
              <p className="text-white font-bold text-lg">{criticalCount}</p>
            </div>
            <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-xl px-4 py-2">
              <p className="text-cyan-400 text-xs">Total</p>
              <p className="text-white font-bold text-lg">{totalEmergencies}</p>
            </div>
          </div>
        </div>

        {/* GRID HEATMAP */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="text-cyan-400" size={20} />
            Density Grid — {GRID_SIZE}×{GRID_SIZE} Zones
          </h3>

          <div className="flex gap-6">
            {/* Grid Visualization */}
            <div className="flex-1">
              <div
                className="grid gap-1 rounded-xl overflow-hidden border border-white/10"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              >
                {grid.map((cell) => (
                  <motion.button
                    key={`${cell.x}-${cell.y}`}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    onClick={() => setSelectedZone(cell)}
                    className="relative aspect-square rounded-sm flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                    style={{ backgroundColor: getDensityColor(cell.density) }}
                    title={`${cell.zone}: ${cell.total} emergencies`}
                  >
                    {cell.total > 0 && (
                      <span className="text-white/90 text-[10px] font-bold">
                        {cell.total}
                      </span>
                    )}
                    {cell.critical > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <span>Density:</span>
                {[
                  { color: "#1e293b", label: "None" },
                  { color: "#065f46", label: "Low" },
                  { color: "#a16207", label: "Med" },
                  { color: "#c2410c", label: "High" },
                  { color: "#dc2626", label: "Critical" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Zones Sidebar */}
            <div className="w-64 space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Hot Zones
              </h4>
              {hotZones.map((zone, i) => (
                <button
                  key={zone.zone}
                  onClick={() => setSelectedZone(zone)}
                  className="w-full bg-gradient-to-r from-gray-800/60 to-gray-900/40 border border-white/10 rounded-lg p-3 text-left hover:border-red-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">
                      #{i + 1} {zone.zone}
                    </span>
                    <span className="text-red-400 font-bold">{zone.total}</span>
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    {zone.critical > 0 && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                        {zone.critical} crit
                      </span>
                    )}
                    {zone.high > 0 && (
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">
                        {zone.high} high
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time-based Area Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-cyan-400" />
              24-Hour Emergency Pattern
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" tick={{ fontSize: 10 }} interval={3} />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                <Legend />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#critGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="high" stroke="#f97316" fill="url(#highGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="medium" stroke="#eab308" fill="url(#medGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Zone Risk Radar */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" />
              Zone Risk Assessment
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="zone" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis stroke="#9ca3af" />
                <Radar name="Risk Score" dataKey="risk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="Density" dataKey="density" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TYPE DISTRIBUTION + SCATTER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Type Bar Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Flame size={18} className="text-orange-400" />
              Emergency Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="type" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {typeData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.type === "flood" ? "#3b82f6" :
                        entry.type === "fire" ? "#f97316" :
                        entry.type === "trapped" ? "#eab308" :
                        entry.type === "medical" ? "#ef4444" : "#6b7280"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter Plot — Density vs Risk */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-cyan-400" />
              Zone Scatter — Density vs Severity
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="total" name="Total" stroke="#9ca3af" label={{ value: "Total", position: "bottom", fill: "#9ca3af" }} />
                <YAxis dataKey="critical" name="Critical" stroke="#9ca3af" label={{ value: "Critical", angle: -90, position: "insideLeft", fill: "#9ca3af" }} />
                <ZAxis dataKey="density" range={[50, 400]} name="Density" />
                <Tooltip content={<HeatCellTooltip />} />
                <Scatter data={grid.filter((c) => c.total > 0)} fill="#06b6d4">
                  {grid.filter((c) => c.total > 0).map((cell, i) => (
                    <Cell
                      key={i}
                      fill={cell.critical > 0 ? "#ef4444" : cell.high > 0 ? "#f97316" : "#06b6d4"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ZONE DETAIL MODAL */}
        <AnimatePresence>
          {selectedZone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Zone {selectedZone.zone}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Grid Position [{selectedZone.x}, {selectedZone.y}]
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X className="text-gray-400" size={20} />
                  </button>
                </div>

                {/* Severity Breakdown */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                    <p className="text-red-400 text-3xl font-bold">{selectedZone.critical}</p>
                    <p className="text-red-400/70 text-xs mt-1">Critical</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                    <p className="text-orange-400 text-3xl font-bold">{selectedZone.high}</p>
                    <p className="text-orange-400/70 text-xs mt-1">High</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                    <p className="text-yellow-400 text-3xl font-bold">{selectedZone.medium}</p>
                    <p className="text-yellow-400/70 text-xs mt-1">Medium</p>
                  </div>
                </div>

                {/* Density Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Density Score</span>
                    <span className="text-white font-bold">{selectedZone.density}</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((selectedZone.density / 20) * 100, 100)}%`,
                        backgroundColor: getDensityColor(selectedZone.density),
                      }}
                    />
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => {
                    setSelectedZone(null);
                    router.push(`/rescue/mapRoute?clusterId=Zone+${selectedZone.zone}&victims=${selectedZone.total}`);
                  }}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation size={18} />
                  Deploy to Zone {selectedZone.zone}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
