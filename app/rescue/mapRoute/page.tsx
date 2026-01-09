"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import { Navigation, LocateFixed, Route, AlertCircle, Users } from "lucide-react";
import "leaflet/dist/leaflet.css";

/* ------------------ DYNAMIC LEAFLET (NO SSR) ------------------ */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((m) => m.Circle),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

export default function MapRoutePage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const [rescuePos, setRescuePos] = useState<[number, number]>([28.6139, 77.209]);
  const [targetZone, setTargetZone] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [victimCount, setVictimCount] = useState(0);
  const [clusterInfo, setClusterInfo] = useState("");
  const [isFollowing, setIsFollowing] = useState(true);
  const [query, setQuery] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  /* ------------------ CLIENT-ONLY LEAFLET SETUP ------------------ */
  useEffect(() => {
    setMounted(true);

    (async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    })();

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const victims = searchParams.get("victims");
    const clusterId = searchParams.get("clusterId");

    if (lat && lng) {
      const coords: [number, number] = [parseFloat(lat), parseFloat(lng)];
      setTargetZone(coords);
      if (victims) setVictimCount(parseInt(victims));
      if (clusterId) setClusterInfo(clusterId);
      generateRoute(coords);
    }
  }, [searchParams]);

  /* ------------------ LIVE GPS ------------------ */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setRescuePos(newPos);
        if (isNavigating && targetZone) {
          generateRoute(targetZone);
        }
      },
      (err) => console.warn("GPS error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [isNavigating, targetZone]);

  /* ------------------ SEARCH ------------------ */
  const fetchCoords = async (place: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        place
      )}&format=json&limit=1`
    );
    const data = await res.json();
    if (!data?.length) return null;
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [
      number,
      number
    ];
  };

  /* ------------------ ROUTE ------------------ */
  const generateRoute = async (destination: [number, number]) => {
    try {
      const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJjYjNlYTlkNjIyYjQ0MGJhZjgwODI3MDJhYmU0MmYwIiwiaCI6Im11cm11cjY0In0=";


      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${rescuePos[1]},${rescuePos[0]}&end=${destination[1]},${destination[0]}`
      );

      const data = await res.json();
      if (!data?.features?.length) throw new Error();

      const coords = data.features[0].geometry.coordinates.map(
        (c: number[]) => [c[1], c[0]] as [number, number]
      );

      const steps = data.features[0].properties.segments[0].steps.map(
        (s: any) => ({
          instruction: s.instruction,
          distance: (s.distance / 1000).toFixed(2),
          duration: Math.round(s.duration / 60),
        })
      );

      setRoute(coords);
      setInstructions(steps);
      setIsFollowing(false);
    } catch {
      const fallbackRoute = [rescuePos, destination];
      setRoute(fallbackRoute);
      setInstructions([
        {
          instruction: "Proceed towards emergency zone",
          distance: "-",
          duration: "~10",
        },
      ]);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    const coords = await fetchCoords(query);
    if (coords) {
      setTargetZone(coords);
      generateRoute(coords);
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setIsFollowing(true);
    alert("Navigation started");
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Emergency Route Planning
        </h1>

        {clusterInfo && (
          <p className="text-cyan-300 flex items-center gap-2 mb-6">
            <AlertCircle size={16} />
            {clusterInfo} — {victimCount} victim
            {victimCount !== 1 ? "s" : ""}
          </p>
        )}

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter location…"
            className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-lg"
          >
            <Navigation size={16} /> Generate Route
          </button>
          <button
            onClick={() => setIsFollowing((v) => !v)}
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg"
          >
            <LocateFixed size={16} />
            {isFollowing ? "Following" : "Follow Unit"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* MAP */}
          <div className="xl:col-span-3 rounded-2xl overflow-hidden">
            <MapContainer center={rescuePos} zoom={14} className="h-[70vh]">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={rescuePos}>
                <Popup>Rescue Unit</Popup>
              </Marker>

              {targetZone && (
                <>
                  <Marker position={targetZone}>
                    <Popup>Emergency Zone</Popup>
                  </Marker>
                  <Circle
                    center={targetZone}
                    radius={500}
                    pathOptions={{ color: "#ef4444", fillOpacity: 0.2 }}
                  />
                </>
              )}

              {route.length > 1 && (
                <Polyline
                  positions={route}
                  pathOptions={{ color: "#06b6d4", weight: 4 }}
                />
              )}
            </MapContainer>
          </div>

          {/* INSTRUCTIONS */}
          <div className="bg-white/5 p-6 rounded-2xl h-[70vh] overflow-y-auto">
            <h3 className="text-white font-semibold mb-4 flex gap-2">
              <Route size={18} /> Route Instructions
            </h3>

            {victimCount > 0 && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 mb-4">
                <p className="text-red-300 flex items-center gap-2">
                  <Users size={16} />
                  {victimCount} people awaiting rescue
                </p>
              </div>
            )}

            {instructions.map((s, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-200">
                  {i + 1}. {s.instruction}
                </p>
                <p className="text-xs text-cyan-400">
                  {s.distance} km • {s.duration} min
                </p>
              </div>
            ))}

            <button
              onClick={handleStartNavigation}
              className="w-full mt-6 px-4 py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold"
            >
              Start Navigation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
