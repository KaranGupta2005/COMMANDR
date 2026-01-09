"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SafeZone } from "@/types/safeZone";
import "leaflet/dist/leaflet.css";

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
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((m) => m.Circle),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

interface SafeZoneMapProps {
  userPosition: [number, number];
  safeZones: SafeZone[];
  selectedZone?: SafeZone | null;
  onZoneClick?: (zone: SafeZone) => void;
  showRoute?: boolean;
  className?: string;
}

export default function SafeZoneMap({
  userPosition,
  safeZones,
  selectedZone,
  onZoneClick,
  showRoute = false,
  className = "h-[500px]",
}: SafeZoneMapProps) {
  const [mounted, setMounted] = useState(false);

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
  }, []);

  const getStatusColor = (status: SafeZone["status"]) => {
    switch (status) {
      case "available":
        return "#22c55e";
      case "near-capacity":
        return "#eab308";
      case "full":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (!mounted) return null;

  return (
    <MapContainer
      center={userPosition}
      zoom={12}
      className={className}
      zoomControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* User Position */}
      <Marker position={userPosition}>
        <Popup>Your Location</Popup>
      </Marker>

      <Circle
        center={userPosition}
        radius={500}
        pathOptions={{
          color: "#06b6d4",
          fillColor: "#06b6d4",
          fillOpacity: 0.1,
        }}
      />

      {/* Safe Zones */}
      {safeZones.map((zone) => (
        <div key={zone.id}>
          <Marker
            position={zone.position}
            eventHandlers={{
              click: () => onZoneClick && onZoneClick(zone),
            }}
          >
            <Popup>
              <div className="text-center p-2">
                <p className="font-semibold">{zone.name}</p>
                <p className="text-sm text-gray-600">
                  {zone.distance} km • {zone.eta} min
                </p>
                <p className="text-sm font-semibold">
                  {zone.occupancy.percentage}% Full
                </p>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={zone.position}
            radius={300}
            pathOptions={{
              color: getStatusColor(zone.status),
              fillColor: getStatusColor(zone.status),
              fillOpacity: 0.15,
            }}
          />
        </div>
      ))}

      {/* Route */}
      {showRoute && selectedZone && (
        <Polyline
          positions={[userPosition, selectedZone.position]}
          pathOptions={{
            color: "#06b6d4",
            weight: 4,
            opacity: 0.8,
          }}
        />
      )}
    </MapContainer>
  );
}
