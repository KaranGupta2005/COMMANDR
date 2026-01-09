"use client";

import { SafeZone } from "@/types/safeZone";

interface SafeZoneCardProps {
  zone: SafeZone;
  onNavigate?: (zone: SafeZone) => void;
  onSelect?: (zone: SafeZone) => void;
}

export default function SafeZoneCard({
  zone,
  onNavigate,
  onSelect,
}: SafeZoneCardProps) {
  const getStatusStyle = (status: SafeZone["status"]) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/40",
          text: "text-green-400",
          dot: "bg-green-400",
        };
      case "near-capacity":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/40",
          text: "text-yellow-400",
          dot: "bg-yellow-400",
        };
      case "full":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/40",
          text: "text-red-400",
          dot: "bg-red-400",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/40",
          text: "text-gray-400",
          dot: "bg-gray-400",
        };
    }
  };

  const colors = getStatusStyle(zone.status);

  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border ${colors.border} rounded-xl p-5 hover:border-cyan-500/50 transition-all cursor-pointer`}
      onClick={() => onSelect?.(zone)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
          <div>
            <h4 className="text-white font-bold text-lg">{zone.name}</h4>
            <p className="text-gray-400 text-sm">{zone.type}</p>
          </div>
        </div>

        {zone.isRecommended && (
          <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-1 rounded">
            RECOMMENDED
          </span>
        )}
      </div>

      {/* Distance & ETA */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-gray-500 text-xs mb-1">Distance</p>
          <p className="text-white font-bold">{zone.distance} km</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-gray-500 text-xs mb-1">ETA</p>
          <p className="text-white font-bold">{zone.eta} min</p>
        </div>
      </div>

      {/* Occupancy */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs">Occupancy</span>
          <span className="text-white text-xs font-bold">
            {zone.occupancy.current}/{zone.occupancy.capacity}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              zone.occupancy.percentage >= 90
                ? "bg-red-500"
                : zone.occupancy.percentage >= 70
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${zone.occupancy.percentage}%` }}
          />
        </div>
      </div>

      {/* Safety Rating */}
      <div className="mb-3 bg-slate-800/50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs">Safety Rating</span>
          <span className="text-green-400 font-bold">
            {zone.safetyRating}/10
          </span>
        </div>
      </div>

      {/* Facilities */}
      <div className="mb-3">
        <p className="text-gray-400 text-xs mb-2">Facilities</p>
        <div className="flex flex-wrap gap-2">
          {zone.facilities.map((facility, idx) => (
            <span
              key={idx}
              className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded"
            >
              {facility}
            </span>
          ))}
        </div>
      </div>

      {/* Last Verified */}
      <div className="text-xs text-gray-500 mb-3">
        Verified {zone.lastVerified}
      </div>

      {/* Navigate */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate?.(zone);
        }}
        className="w-full py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-500/30 transition-all"
        disabled={zone.status === "full"}
      >
        Navigate to Zone
      </button>
    </div>
  );
}
