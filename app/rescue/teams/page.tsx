"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Users,
  MapPin,
  MessageCircle,
  Send,
  X,
  Navigation,
  Clock,
  Loader2,
} from "lucide-react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/app/providers/AuthProvider";
import apiClient from "@/lib/api/client";

/* ------------------ TYPES ------------------ */
interface Team {
  _id: string;
  name: string;
  location: string;
  position: [number, number];
  distance: number;
  status: "available" | "on-mission" | "offline";
  members: number;
  lastUpdate: string;
}

interface ChatMessage {
  senderId: string;
  message: string;
  timestamp: string | Date;
}

/* ------------------ HELPERS ------------------ */
const getStatusStyle = (status: Team["status"]) => {
  switch (status) {
    case "available":
      return { dot: "bg-green-400", text: "text-green-400", border: "border-green-500/30" };
    case "on-mission":
      return { dot: "bg-yellow-400", text: "text-yellow-400", border: "border-yellow-500/30" };
    default:
      return { dot: "bg-gray-400", text: "text-gray-400", border: "border-gray-500/30" };
  }
};

export default function TeamCoordination() {
  const { user, loading: authLoading } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [nearbyTeams, setNearbyTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [chatJoined, setChatJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Location
  const [myPosition, setMyPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => setMounted(true), []);

  /* ========== GET USER LOCATION ========== */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // Default to Delhi if geolocation fails
        setMyPosition({ lat: 28.6139, lng: 77.209 });
      }
    );
  }, []);

  /* ========== FETCH NEARBY TEAMS FROM API ========== */
  useEffect(() => {
    if (!myPosition || !user) return;

    const fetchNearbyTeams = async () => {
      try {
        setLoadingTeams(true);
        const res = await apiClient.get("/rescue/nearby", {
          params: { lat: myPosition.lat, lng: myPosition.lng, radius: 50 },
        });

        const teams: Team[] = (res.data.teams || []).map((t: any) => ({
          _id: t._id,
          name: t.name || `Team ${t._id.slice(-4).toUpperCase()}`,
          location: t.location || "Unknown",
          position: t.position || [myPosition.lat, myPosition.lng],
          distance: t.distance || 0,
          status: t.status || "offline",
          members: t.members || 1,
          lastUpdate: t.lastUpdate || "N/A",
        }));

        setNearbyTeams(teams);
      } catch (err: any) {
        console.error("Failed to fetch nearby teams:", err.message);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchNearbyTeams();
  }, [myPosition, user]);

  /* ========== SOCKET: RESCUE CHAT ========== */
  useEffect(() => {
    if (!myPosition || !user || user.role !== "rescue") return;

    // Join nearby rescue chat room
    socket.emit("rescue:join-nearby", { lat: myPosition.lat, lng: myPosition.lng });

    const onJoinedRoom = () => {
      setChatJoined(true);
      setMessages([]);
    };

    const onNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("rescue:joined-room", onJoinedRoom);
    socket.on("rescue:new-message", onNewMessage);

    return () => {
      socket.off("rescue:joined-room", onJoinedRoom);
      socket.off("rescue:new-message", onNewMessage);
    };
  }, [myPosition, user]);

  /* ========== SOCKET: LIVE LOCATION UPDATES ========== */
  useEffect(() => {
    if (!user || user.role !== "rescue" || !myPosition) return;

    const handleRescueLocation = ({ userId, lat, lng }: { userId: string; lat: number; lng: number }) => {
      if (userId === user.id) return;

      setNearbyTeams((prev) => {
        const existing = prev.find((t) => t._id === userId);
        if (existing) {
          return prev.map((t) =>
            t._id === userId
              ? { ...t, position: [lat, lng] as [number, number], location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lastUpdate: "Just now" }
              : t
          );
        }
        return prev;
      });
    };

    socket.on("rescueLocation", handleRescueLocation);
    return () => { socket.off("rescueLocation", handleRescueLocation); };
  }, [user, myPosition]);

  /* ========== AUTO SCROLL CHAT ========== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ========== HANDLERS ========== */
  const handleSendMessage = () => {
    if (!message.trim()) return;
    socket.emit("rescue:send-message", { message: message.trim() });
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
    // Navigate to mapRoute page with target coordinates
    const [lat, lng] = selectedTeam.position;
    window.location.href = `/rescue/mapRoute?lat=${lat}&lng=${lng}&clusterId=${selectedTeam.name}`;
  };

  /* ========== LOADING STATES ========== */
  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "rescue") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
        <p className="text-white text-xl">Rescue team access only</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Team Coordination Hub
          </h1>
          <p className="text-cyan-300">
            Real-time collaboration • {nearbyTeams.length} nearby team{nearbyTeams.length !== 1 ? "s" : ""}
            {myPosition && (
              <span className="text-gray-400 text-sm ml-4">
                📍 {myPosition.lat.toFixed(4)}, {myPosition.lng.toFixed(4)}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT: Teams List */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-cyan-400" />
                Nearby Rescue Teams ({nearbyTeams.length})
              </h3>

              {loadingTeams ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mr-3" />
                  <span className="text-gray-400">Scanning nearby teams...</span>
                </div>
              ) : nearbyTeams.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
                  <p>No nearby teams found</p>
                  <p className="text-sm mt-1">Other rescue members need to be online and sharing location</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {nearbyTeams.map((team) => {
                    const colors = getStatusStyle(team.status);
                    return (
                      <div
                        key={team._id}
                        onClick={() => handleTeamSelect(team)}
                        className={`p-4 rounded-xl border ${colors.border} bg-gradient-to-r from-gray-800/50 to-gray-900/30 hover:border-cyan-500/50 transition-all cursor-pointer`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
                            <div>
                              <h4 className="text-white font-semibold text-lg">{team.name}</h4>
                              <p className="text-gray-400 text-sm flex items-center gap-2">
                                <MapPin size={14} /> {team.location}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleTeamSelect(team); }}
                            className="p-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 hover:bg-cyan-500/30"
                          >
                            <Navigation size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Distance</p>
                            <p className="text-white font-semibold">{team.distance} km</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Members</p>
                            <p className="text-white font-semibold">{team.members}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Status</p>
                            <p className={`${colors.text} font-semibold capitalize text-xs`}>
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
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Chat Panel */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col h-[calc(100vh-180px)]">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <MessageCircle className="text-cyan-400" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold">Nearby Team Chat</p>
                <p className="text-xs text-gray-400">
                  {chatJoined ? `${messages.length} messages • Connected` : "Connecting..."}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
              {messages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="mx-auto h-10 w-10 opacity-30 mb-3" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Send a message to nearby rescue teams</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
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
                        Team {msg.senderId?.slice(-4).toUpperCase()}
                      </p>
                    )}
                    <p>{msg.message}</p>
                    <p className="text-[10px] opacity-70 text-right mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                  onKeyDown={handleKeyPress}
                  placeholder="Send message to nearby teams..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
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
                <h3 className="text-xl font-bold text-white">Navigate to Team</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="text-gray-400" size={20} />
                </button>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusStyle(selectedTeam.status).dot} animate-pulse`} />
                  <div>
                    <p className="text-white font-bold text-lg">{selectedTeam.name}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <MapPin size={14} /> {selectedTeam.location}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Distance</p>
                    <p className="text-white font-bold">{selectedTeam.distance} km</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Members</p>
                    <p className="text-white font-bold">{selectedTeam.members}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Status</p>
                    <p className={`${getStatusStyle(selectedTeam.status).text} font-bold capitalize text-xs`}>
                      {selectedTeam.status.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartNavigation}
                  className="flex-1 py-3 bg-cyan-500 text-slate-900 rounded-xl font-semibold hover:bg-cyan-400 flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  Navigate
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
