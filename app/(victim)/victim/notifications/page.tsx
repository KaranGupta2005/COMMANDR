"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { useSocket } from "@/contexts/SocketContext";

type NotificationType = "success" | "warning" | "info" | "alert";

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

function mapEventToType(eventType: string): NotificationType {
  if (eventType.includes("CRITICAL")) return "alert";
  if (eventType.includes("FAIL")) return "warning";
  if (eventType.includes("SUCCESS")) return "success";
  return "info";
}

function formatRelativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

export default function NotificationsPage() {
  const { notifications: socketNotifications, connected } = useSocket();

  console.log("🔌 Socket connected:", connected);
  console.log("🔔 Socket notifications count:", socketNotifications.length);
  console.log("🔔 Latest socket notification:", socketNotifications[0]);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>("all");

  // 🔥 FIXED: Process ALL new socket notifications
  useEffect(() => {
    if (!socketNotifications?.length) return;

    console.log("📱 Processing", socketNotifications.length, "socket notifications");

    // Process ALL notifications in the array (not just [0])
    socketNotifications.forEach((socketNotif) => {
      if (!socketNotif.payload) return;

      setNotifications((prev) => {
        // Check if notification already exists (by timestamp + message)
        const alreadyExists = prev.some(
          (n) =>
            n.timestamp === socketNotif.payload!.createdAt &&
            n.message === socketNotif.payload!.message
        );

        if (alreadyExists) {
          console.log("⏭️ Duplicate skipped:", socketNotif.payload.title);
          return prev;
        }

        const mapped: AppNotification = {
          id: crypto.randomUUID(),
          type: mapEventToType(socketNotif.eventType),
          title: socketNotif.payload.title || "System Update",
          message: socketNotif.payload.message || "New notification",
          timestamp: socketNotif.payload.createdAt || new Date().toISOString(),
          read: false,
          actionable: !!socketNotif.payload.actionable,
        };

        console.log("✅ Added notification:", mapped.title);
        return [mapped, ...prev];
      });
    });
  }, [socketNotifications.length]); // 🔥 Trigger on LENGTH change

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const iconMap: Record<NotificationType, React.ReactNode> = {
    success: <CheckCircle className="text-green-400" size={24} />,
    warning: <AlertTriangle className="text-yellow-400" size={24} />,
    info: <Info className="text-blue-400" size={24} />,
    alert: <Bell className="text-red-400" size={24} />,
  };

  const colorMap: Record<NotificationType, string> = {
    success: "border-green-500/30 bg-green-500/10",
    warning: "border-yellow-500/30 bg-yellow-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
    alert: "border-red-500/30 bg-red-500/10",
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      <Sidebar role="victim" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Connection Status */}
        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
          <span className={`inline-flex items-center gap-2 text-sm ${
            connected ? 'text-green-400' : 'text-red-400'
          }`}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          <span className="text-xs text-gray-500 ml-4">
            Socket: {socketNotifications.length} | Local: {notifications.length}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white flex gap-3 items-center">
              <Bell className="text-blue-400" /> Notifications
            </h1>
            <p className="text-gray-400">
              {unreadCount ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all"
            >
              Clear All ({notifications.length})
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap items-center">
          {["all", "unread", "alert", "warning", "success", "info"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {f === "unread" ? `Unread (${unreadCount})` : f.toUpperCase()}
            </button>
          ))}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <BellOff size={64} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {connected ? "You're all caught up!" : "Connect to receive updates"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`border rounded-2xl p-6 transition-all hover:shadow-xl ${
                  n.read ? "opacity-70 border-white/10" : colorMap[n.type]
                }`}
              >
                <div className="flex gap-4">
                  {iconMap[n.type]}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-white truncate">{n.title}</h3>
                      <div className="flex gap-2 flex-shrink-0">
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="p-1 hover:bg-white/10 rounded-full"
                            title="Mark as read"
                          >
                            <CheckCircle size={16} className="text-green-400" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="p-1 hover:bg-red-500/20 rounded-full"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mt-1 line-clamp-2">{n.message}</p>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 items-center">
                      <span className="flex gap-1 items-center">
                        <Clock size={14} />
                        {formatRelativeTime(n.timestamp)}
                      </span>
                      {n.actionable && !n.read && (
                        <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
