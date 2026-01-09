"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/app/providers/AuthProvider";
import { Location, RescueMessage, SocketNotification } from "@/types";

interface SocketContextType {
  connected: boolean;
  notifications: SocketNotification[];
  clearNotifications: () => void;
  victimLocations: Map<string, Location>;
  rescueLocations: Map<string, Location>;
  rescueMessages: RescueMessage[];
  sendRescueMessage: (message: string) => void;
  joinRescueChat: (lat: number, lng: number) => void;
  route: any;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  // Use refs to prevent stale closures and re-registration
  const notificationsRef = useRef<SocketNotification[]>([]);
  const handlersRef = useRef<Record<string, any>>({});
  const mountedRef = useRef(false);

  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<SocketNotification[]>([]);
  const [victimLocations, setVictimLocations] = useState<Map<string, Location>>(new Map());
  const [rescueLocations, setRescueLocations] = useState<Map<string, Location>>(new Map());
  const [rescueMessages, setRescueMessages] = useState<RescueMessage[]>([]);
  const [route, setRoute] = useState<any>(null);

  // Update notifications state from ref
  useEffect(() => {
    setNotifications(notificationsRef.current);
  }, []);

  // Socket lifecycle - only run once
  useEffect(() => {
    if (loading || !user || mountedRef.current) return;

    console.log("🚀 Initializing socket connection...");
    
    // Global logging
    socket.onAny((event, ...args) => {
      console.log("📡 SOCKET EVENT:", event, args);
    });

    socket.connect();

    // Connection handlers
    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      setConnected(true);
    };

    const onDisconnect = () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    };

    // Store handlers in refs to prevent recreation
    handlersRef.current = {
      connect: onConnect,
      disconnect: onDisconnect,
      notification: (data: SocketNotification) => {
        console.log("🔔 NOTIFICATION RECEIVED:", data);
        notificationsRef.current = [data, ...notificationsRef.current];
        setNotifications((prev) => [data, ...prev]); 
      },
      victimLocation: ({ userId, lat, lng }: any) => {
        setVictimLocations((prev) => {
          const map = new Map(prev);
          map.set(userId, { lat, lng });
          return map;
        });
      },
      rescueLocation: ({ userId, lat, lng }: any) => {
        setRescueLocations((prev) => {
          const map = new Map(prev);
          map.set(userId, { lat, lng });
          return map;
        });
      },
      rescueMessage: (msg: RescueMessage) => {
        setRescueMessages((prev) => [...prev, msg]);
      },
      rescueJoined: () => {
        setRescueMessages([]);
      },
      routeUpdate: (newRoute: any) => {
        setRoute(newRoute);
      },
    };

    // Register listeners
    socket.on("connect", handlersRef.current.connect);
    socket.on("disconnect", handlersRef.current.disconnect);
    socket.on("notification:new", handlersRef.current.notification);

    if (user.role === "rescue" || user.role === "logistics") {
      socket.on("victimLocation", handlersRef.current.victimLocation);
    }

    if (user.role === "logistics") {
      socket.on("rescueLocation", handlersRef.current.rescueLocation);
    }

    if (user.role === "rescue") {
      socket.on("rescue:new-message", handlersRef.current.rescueMessage);
      socket.on("rescue:joined-room", handlersRef.current.rescueJoined);
    }

    socket.on("route:update", handlersRef.current.routeUpdate);

    mountedRef.current = true;

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("connect", handlersRef.current.connect);
      socket.off("disconnect", handlersRef.current.disconnect);
      socket.off("notification:new", handlersRef.current.notification);
      socket.off("victimLocation", handlersRef.current.victimLocation);
      socket.off("rescueLocation", handlersRef.current.rescueLocation);
      socket.off("rescue:new-message", handlersRef.current.rescueMessage);
      socket.off("rescue:joined-room", handlersRef.current.rescueJoined);
      socket.on("route:update", handlersRef.current.routeUpdate);
      socket.disconnect();
    };
  }, []); // Empty deps - only run once!

  const sendRescueMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit("rescue:send-message", { message });
  };

  const joinRescueChat = (lat: number, lng: number) => {
    socket.emit("rescue:join-nearby", { lat, lng });
  };

  const clearNotifications = () => {
    notificationsRef.current = [];
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{
        connected,
        notifications,
        clearNotifications,
        victimLocations,
        rescueLocations,
        rescueMessages,
        sendRescueMessage,
        joinRescueChat,
        route,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};
