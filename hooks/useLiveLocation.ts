"use client";

import { useEffect, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/app/providers/AuthProvider";

type Location = { lat: number; lng: number };

const getDistanceInMeters = (a: Location, b: Location) => {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
};

export const useLiveLocation = () => {
  const { connected } = useSocket();
  const { user } = useAuth();

  const lastLocationRef = useRef<Location | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!connected || !user) return;
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        if (lastLocationRef.current) {
          const dist = getDistanceInMeters(lastLocationRef.current, current);
          if (dist < 20) return;
        }

        lastLocationRef.current = current;

        // ✅ only emit, no socket lifecycle here
        import("@/lib/socket").then(({ socket }) => {
          socket.emit("locationUpdate", {
            ...current,
            role: user.role,
          });
        });
      },
      () => {},
      {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [connected, user]);
};
