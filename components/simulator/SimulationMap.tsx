"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

interface SimulationMapProps {
  simulationData: any | null;
}

// Helper to auto-zoom to the action when simulation runs
const MapController = ({ active }: { active: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (active) {
      map.flyTo([28.6139, 77.209], 14, { duration: 2 });
    }
  }, [active, map]);
  return null;
};

const SimulationMap: React.FC<SimulationMapProps> = ({ simulationData }) => {
  // --- MOCK DATA ---
  const center: [number, number] = [28.6139, 77.209];

  // 1. The Normal Route (Before Disaster) - Grey/Blue
  const normalRoute: [number, number][] = [
    [28.61, 77.2],
    [28.612, 77.205],
    [28.6139, 77.209],
    [28.615, 77.215],
    [28.62, 77.22],
  ];

  // 2. The Disaster Zone (Bridge Collapse) - Red Circle
  const disasterZone = {
    center: [28.6139, 77.209] as [number, number],
    radius: 300,
  };

  // 3. The AI Optimized Route (Detour) - Green
  const optimizedRoute: [number, number][] = [
    [28.61, 77.2],
    [28.605, 77.202],
    [28.608, 77.225],
    [28.62, 77.22],
  ];

  return (
    <div className="w-full h-full bg-slate-900 relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        {/* DARK MODE TILES */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController active={!!simulationData} />

        {/* ALWAYS VISIBLE: The Start and End points */}
        <Circle
          center={normalRoute[0]}
          radius={100}
          pathOptions={{ color: "cyan", fillColor: "cyan", fillOpacity: 0.5 }}
        />
        <Circle
          center={normalRoute[normalRoute.length - 1]}
          radius={100}
          pathOptions={{ color: "white", fillColor: "white", fillOpacity: 0.5 }}
        />

        {/* STATE 1: NORMAL (No Simulation yet) */}
        {!simulationData && (
          <Polyline
            positions={normalRoute}
            pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.6 }}
          />
        )}

        {/* STATE 2: SIMULATION ACTIVE */}
        {simulationData && (
          <>
            {/* 1. The Broken Path (Red Dashed) */}
            <Polyline
              positions={normalRoute}
              pathOptions={{
                color: "#ef4444",
                weight: 3,
                dashArray: "10, 10",
                opacity: 0.5,
              }}
            />

            {/* 2. The Disaster Zone (Pulsing Red) */}
            <Circle
              center={disasterZone.center}
              radius={disasterZone.radius}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.3,
              }}
            >
              <Popup className="text-black">
                <strong>CRITICAL FAILURE</strong>
                <br />
                Bridge ID: B-92
                <br />
                Status: COLLAPSED
              </Popup>
            </Circle>

            {/* 3. The New AI Route (Glowing Green) */}
            <Polyline
              positions={optimizedRoute}
              pathOptions={{ color: "#22c55e", weight: 5, opacity: 0.9 }}
            />
          </>
        )}
      </MapContainer>

      {/* CSS overlay for CRT Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[400] bg-[length:100%_2px,3px_100%] opacity-20"></div>
    </div>
  );
};

export default SimulationMap;
