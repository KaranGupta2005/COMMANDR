"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import SafeZoneMap from "@/components/Map";
import {
  Users,
  MapPin,
  MessageCircle,
  Send,
  X,
  Navigation,
  Clock,
} from "lucide-react";
import { socket } from "@/lib/socket";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouteUpdates } from "@/hooks/useRouteUpdates";

/* ------------------ TYPES ------------------ */
interface Team {
  id: string;
  name: string;
  location: string;
  position: [number, number];
  distance: number;
  status: "available" | "on-mission" | "offline";
  members: number;
  lastUpdate: string;
  userId: string;
}

interface Message {
  id: string;
  sender: string;
  senderId?: string;
  text?: string;
  message?: string;
  timestamp?: string | Date;
  time?: string;
}

/* ------------------ GEO UTILS ------------------ */
const getDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getStatusStyle = (status: Team["status"]) => {
  switch (status) {
    case "available":
      return {
        dot: "bg-green-400",
        text: "text-green-400",
        border: "border-green-500/30",
      };
    case "on-mission":
      return {
        dot: "bg-yellow-400",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
      };
    default:
      return {
        dot: "bg-gray-400",
        text: "text-gray-400",
        border: "border-gray-500/30",
      };
  }
};

export default function TeamCoordination() {
  // ✅ ALL STATE DECLARED FIRST
  const [mounted, setMounted] = useState(false);
  const [nearbyTeams, setNearbyTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [message, setMessage] = useState(""); // ✅ FIXED: Missing message state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ SAFE: useAuth AFTER "use client" & inside AuthProvider
  const { user, loading: authLoading } = useAuth();

  // ✅ Custom hooks - SAFE with loading guards

  const {
    notifications,
    rescueMessages,
    sendRescueMessage,
    joinRescueChat,
    route,
  } = useSocket();

  const routeUpdates = useRouteUpdates();

  // ✅ Socket: Nearby teams (10km radius only)
  useEffect(() => {
    if (
      !user?.id ||
      user.role !== "rescue" ||
      !myPosition?.lat ||
      !myPosition?.lng
    )
      return;

    const handleRescueLocation = ({
      userId,
      lat,
      lng,
    }: {
      userId: string;
      lat: number;
      lng: number;
    }) => {
      // Skip self
      if (userId === user.id) return;

      const distKm =
        getDistanceMeters(myPosition.lat, myPosition.lng, lat, lng) / 1000;
      if (distKm > 10) {
        setNearbyTeams((prev) => prev.filter((t) => t.userId !== userId));
        return;
      }

      const team: Team = {
        id: userId,
        userId,
        name: `Team ${userId.slice(-4).toUpperCase()}`,
        location: `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
        position: [lat, lng],
        distance: +distKm.toFixed(1),
        status: "available",
        members: 4 + Math.floor(Math.random() * 3),
        lastUpdate: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setNearbyTeams((prev) => {
        const exists = prev.find((t) => t.id === userId);
        return exists
          ? prev.map((t) => (t.id === userId ? team : t))
          : [team, ...prev].slice(0, 10);
      });
    };

    socket.on("rescueLocation", handleRescueLocation);
    socket.emit("rescue:join-nearby", {
      lat: myPosition.lat,
      lng: myPosition.lng,
    });

    return () => socket.off("rescueLocation", handleRescueLocation);
  }, [user, myPosition]);

  // ✅ Socket: Routes
  useEffect(() => {
    const handleRouteUpdate = (route: any) => {
      setRouteData(route);
      setShowRoute(true);
    };
    const handleRouteError = (error: any) =>
      console.error("Route error:", error);

    socket.on("route:update", handleRouteUpdate);
    socket.on("route:error", handleRouteError);

    return () => {
      socket.off("route:update", handleRouteUpdate);
      socket.off("route:error", handleRouteError);
    };
  }, []);

  // ✅ Route updates from hook
  useEffect(() => {
    if (routeUpdates) {
      setRouteData(routeUpdates);
      setShowRoute(true);
    }
  }, [routeUpdates]);

  // ✅ Lifecycle
  useEffect(() => setMounted(true), []);
  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages],
  );

  // ✅ Event handlers - SAFE
  const handleSendMessage = () => {
    if (!message.trim() || typeof chatSendMessage !== "function") return;
    chatSendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const handleStartNavigation = () => {
    if (!selectedTeam || !myPosition) return;
    setShowModal(false);
    socket.emit("route:request", {
      start: [myPosition.lat, myPosition.lng],
      end: selectedTeam.position,
      teamId: selectedTeam.id,
    });
  };

  // ✅ FIXED: Comprehensive loading guard
  if (!mounted || authLoading || !user || user.role !== "rescue") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
        <div className="text-center text-white">
          <Users className="mx-auto h-12 w-12 text-cyan-400 animate-spin" />
          <h2 className="mt-4 text-2xl font-bold">
            Loading Team Coordination...
          </h2>
          <p className="mt-2 text-gray-400">
            {authLoading
              ? "Authenticating..."
              : !user
                ? "Please login first"
                : "Rescue team access only"}
          </p>
        </div>
      </div>
    );
  }

  // ✅ Map adapter
  const teamsAsSafeZones = nearbyTeams.map((team) => ({
    id: team.id,
    name: team.name,
    type: "Team",
    position: team.position,
    status: "available",
    distance: team.distance,
    eta: Math.round(team.distance * 15),
    occupancy: {
      current: team.members,
      capacity: 10,
      percentage: (team.members / 10) * 100,
    },
    facilities: [],
    safetyRating: 8.5,
    lastVerified: team.lastUpdate,
    address: team.location,
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Team Coordination Hub
          </h1>
          <p className="text-cyan-300">
            Real-time collaboration ({nearbyTeams.length} teams)
            {myPosition && (
              <span className="text-gray-400 text-sm ml-4">
                • {myPosition.lat?.toFixed(4)}, {myPosition.lng?.toFixed(4)}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT: Teams + Map */}
          <div className="xl:col-span-2 space-y-6">
            {/* Teams List */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-cyan-400" />
                Nearby Rescue Teams ({nearbyTeams.length})
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {nearbyTeams.map((team) => {
                  const colors = getStatusStyle(team.status);
                  return (
                    <div
                      key={team.id}
                      onClick={() => handleTeamSelect(team)}
                      className={`p-4 rounded-xl border ${colors.border} bg-gradient-to-r from-gray-800/50 to-gray-900/30 hover:border-cyan-500/50 transition-all cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`}
                          />
                          <div>
                            <h4 className="text-white font-semibold text-lg">
                              {team.name}
                            </h4>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <MapPin size={14} /> {team.location}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeamSelect(team);
                          }}
                          className="p-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                        >
                          <Navigation size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Distance</p>
                          <p className="text-white font-semibold">
                            {team.distance} km
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Members</p>
                          <p className="text-white font-semibold">
                            {team.members}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status</p>
                          <p
                            className={`${colors.text} font-semibold capitalize text-xs`}
                          >
                            {team.status.replace("-", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-gray-400 text-xs flex items-center gap-2">
                          <Clock size={12} /> Last update: {team.lastUpdate}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {nearbyTeams.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
                    <p>No nearby teams found</p>
                    <p className="text-sm mt-1">
                      Move around to discover teams
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-cyan-400" />
                Teams Location Map
              </h3>
              <div className="rounded-xl overflow-hidden border border-white/5">
                <SafeZoneMap
                  userPosition={
                    myPosition
                      ? [myPosition.lat, myPosition.lng]
                      : [28.6139, 77.209]
                  }
                  safeZones={teamsAsSafeZones}
                  selectedZone={
                    selectedTeam
                      ? teamsAsSafeZones.find(
                          (z) => z.id === selectedTeam.id,
                        ) || null
                      : null
                  }
                  onZoneClick={(zone) => {
                    const team = nearbyTeams.find((t) => t.id === zone.id);
                    if (team) handleTeamSelect(team);
                  }}
                  route={showRoute ? routeData : null}
                  showRoute={showRoute}
                  className="h-[400px]"
                />
              </div>
              {selectedTeam && showRoute && routeData && (
                <div className="mt-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/40 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-400 text-sm font-semibold mb-1">
                        Navigating to
                      </p>
                      <p className="text-white font-bold text-lg">
                        {selectedTeam.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {selectedTeam.location} • {selectedTeam.distance} km
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowRoute(false);
                        setRouteData(null);
                      }}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg font-semibold hover:bg-red-500/30"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <MessageCircle className="text-cyan-400" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold">Nearby Team Chat</p>
                <p className="text-xs text-gray-400">
                  {messages.length > 0
                    ? `${messages.length} messages`
                    : "Connect with teams"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              {messages.map((msg: any, index: number) => (
                <div
                  key={msg.id || msg.timestamp || index}
                  className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${
                      msg.senderId === user.id
                        ? "bg-cyan-500 text-slate-900"
                        : "bg-gray-800 text-white border border-gray-700"
                    }`}
                  >
                    {msg.senderId !== user.id && (
                      <p className="text-xs opacity-70 mb-1 font-semibold">
                        Team Member
                      </p>
                    )}
                    <p>{msg.message || msg.text}</p>
                    <p className="text-[10px] opacity-70 text-right mt-1">
                      {new Date(
                        msg.timestamp || msg.time || Date.now(),
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Send message to nearby teams..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Modal */}
        {showModal && selectedTeam && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Navigate to Team
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="text-gray-400" size={20} />
                </button>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusStyle(selectedTeam.status).dot} animate-pulse`}
                  />
                  <div>
                    <p className="text-white font-bold text-lg">
                      {selectedTeam.name}
                    </p>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <MapPin size={14} /> {selectedTeam.location}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Distance</p>
                    <p className="text-white font-bold">
                      {selectedTeam.distance} km
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Members</p>
                    <p className="text-white font-bold">
                      {selectedTeam.members}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Status</p>
                    <p
                      className={`${getStatusStyle(selectedTeam.status).text} font-bold capitalize text-xs`}
                    >
                      {selectedTeam.status.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartNavigation}
                  className="flex-1 py-3 bg-cyan-500 text-slate-900 rounded-xl font-semibold hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  Start Navigation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
