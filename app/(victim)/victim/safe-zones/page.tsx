"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import SafeZoneMap from "@/components/Map";
import SafeZoneCard from "@/components/NavigateCards";
import EmergencyInstructions from "@/components/Emergency";
import { SafeZone, DisasterType } from "@/app/types/safeZone";

const MOCK_SAFE_ZONES: SafeZone[] = [
  {
    id: "SZ-001",
    name: "ABC Government School",
    type: "School",
    position: [28.6304, 77.2177],
    status: "available",
    distance: 1.4,
    eta: 18,
    occupancy: { current: 120, capacity: 200, percentage: 60 },
    facilities: ["Food", "Water", "Medical", "Power", "Toilets"],
    safetyRating: 9.2,
    lastVerified: "5 min ago",
    address: "Connaught Place, New Delhi",
    isRecommended: true,
  },
  {
    id: "SZ-002",
    name: "City Sports Stadium",
    type: "Stadium",
    position: [28.6519, 77.1909],
    status: "near-capacity",
    distance: 3.2,
    eta: 38,
    occupancy: { current: 850, capacity: 1000, percentage: 85 },
    facilities: ["Food", "Water", "Medical", "Toilets"],
    safetyRating: 8.5,
    lastVerified: "12 min ago",
    address: "Karol Bagh, New Delhi",
  },
  {
    id: "SZ-003",
    name: "Community Hall - Sector 12",
    type: "Community Center",
    position: [28.5494, 77.2501],
    status: "available",
    distance: 5.8,
    eta: 45,
    occupancy: { current: 45, capacity: 150, percentage: 30 },
    facilities: ["Food", "Water", "Power", "Toilets"],
    safetyRating: 7.8,
    lastVerified: "8 min ago",
    address: "Nehru Place, New Delhi",
  },
  {
    id: "SZ-004",
    name: "Central Relief Camp",
    type: "Relief Camp",
    position: [28.5921, 77.046],
    status: "full",
    distance: 8.2,
    eta: 62,
    occupancy: { current: 500, capacity: 500, percentage: 100 },
    facilities: ["Food", "Water", "Medical", "Power", "Toilets"],
    safetyRating: 8.9,
    lastVerified: "3 min ago",
    address: "Dwarka, New Delhi",
  },
  {
    id: "SZ-005",
    name: "District Hospital Shelter",
    type: "Hospital",
    position: [28.7496, 77.0669],
    status: "available",
    distance: 12.5,
    eta: 95,
    occupancy: { current: 80, capacity: 120, percentage: 67 },
    facilities: ["Food", "Water", "Medical", "Power", "Toilets"],
    safetyRating: 9.5,
    lastVerified: "2 min ago",
    address: "Rohini, New Delhi",
  },
];

export default function SafeZonesPage() {
  const [mounted, setMounted] = useState(false);
  const [myPosition, setMyPosition] = useState<[number, number]>([
    28.6139, 77.209,
  ]);
  const [selectedZone, setSelectedZone] = useState<SafeZone | null>(null);
  const [disasterType, setDisasterType] = useState<DisasterType>("flood");
  const [showRoute, setShowRoute] = useState(false);

  /* ------------------ EFFECTS ------------------ */
  useEffect(() => {
    setMounted(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMyPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.warn("Location error:", err)
      );
    }
  }, []);

  /* ------------------ DERIVED DATA ------------------ */
  const recommendedZone = useMemo(
    () => MOCK_SAFE_ZONES.find((z) => z.isRecommended),
    []
  );

  const sortedZones = useMemo(() => {
    const statusPriority: Record<SafeZone["status"], number> = {
      available: 0,
      "near-capacity": 1,
      full: 2,
      unsafe: 3,
    };

    return [...MOCK_SAFE_ZONES].sort(
      (a, b) =>
        statusPriority[a.status] - statusPriority[b.status] ||
        a.distance - b.distance
    );
  }, []);

  /* ------------------ HANDLERS ------------------ */
  const handleNavigate = (zone: SafeZone) => {
    setSelectedZone(zone);
    setShowRoute(true);
    alert(`Navigating to ${zone.name}`);
  };

  const handleZoneSelect = (zone: SafeZone) => {
    setSelectedZone(zone);
    setShowRoute(true);
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="victim" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Safe Zones Navigator
          </h1>
          <p className="text-cyan-300">
            Find the nearest safe evacuation point
          </p>
        </div>

        {/* Disaster Type Selector */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm font-medium mb-2 block">
            Current Disaster Type
          </label>
          <div className="flex gap-3">
            {(["flood", "fire", "earthquake", "cyclone"] as DisasterType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setDisasterType(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    disasterType === type
                      ? "bg-cyan-500 text-slate-900"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Recommended Zone */}
        {recommendedZone && (
          <div className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 rounded-2xl p-6">
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Recommended Safe Zone
                </h3>
                <p className="text-2xl font-bold text-cyan-400 mb-2">
                  {recommendedZone.name}
                </p>
                <p className="text-gray-300">
                  {recommendedZone.distance} km • {recommendedZone.eta} min ETA
                </p>
              </div>
              <button
                onClick={() => handleNavigate(recommendedZone)}
                className="px-6 py-3 bg-cyan-500 text-slate-900 rounded-xl font-bold"
              >
                Navigate
              </button>
            </div>
          </div>
        )}

        {/* Emergency Instructions */}
        <EmergencyInstructions disasterType={disasterType} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white/5 rounded-2xl p-6">
            <SafeZoneMap
              userPosition={myPosition}
              safeZones={MOCK_SAFE_ZONES}
              selectedZone={selectedZone}
              onZoneClick={handleZoneSelect}
              showRoute={showRoute}
            />
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Available Safe Zones ({sortedZones.length})
            </h3>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {sortedZones.map((zone) => (
                <SafeZoneCard
                  key={zone.id}
                  zone={zone}
                  onNavigate={handleNavigate}
                  onSelect={handleZoneSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}