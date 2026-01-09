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

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<
    "all" | "unread" | NotificationType
  >("all");

  /* ================= SOCKET → UI ================= */

  useEffect(() => {
    if (!socketNotifications.length) return;

    setNotifications((prev) => {
      const newOnes: AppNotification[] = [];

      socketNotifications.forEach((sn) => {
        if (!sn.payload) return;

        const exists = prev.some(
          (n) =>
            n.timestamp === sn.payload!.createdAt &&
            n.message === sn.payload!.message
        );

        if (!exists) {
          newOnes.push({
            id: crypto.randomUUID(),
            type: mapEventToType(sn.eventType),
            title: sn.payload.title || "System Update",
            message: sn.payload.message || "New notification",
            timestamp: sn.payload.createdAt || new Date().toISOString(),
            read: false,
            actionable: !!sn.payload.actionable,
          });
        }
      });

      if (!newOnes.length) return prev;
      return [...newOnes, ...prev];
    });
  }, [socketNotifications.length]);

  /* ================= DERIVED ================= */

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  /* ================= ACTIONS ================= */

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

  /* ================= UI MAPS ================= */

  const iconMap: Record<NotificationType, JSX.Element> = {
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

  /* ================= RENDER ================= */

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      <Sidebar role="victim" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Connection */}
        <div className="mb-4 text-sm">
          <span className={connected ? "text-green-400" : "text-red-400"}>
            {connected ? "🟢 Connected" : "🔴 Disconnected"}
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
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "unread", "alert", "warning", "success", "info"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg ${
                filter === f ? "bg-blue-500 text-white" : "bg-white/5 text-gray-400"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto px-4 py-2 bg-white/10 text-white rounded-lg"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-400">
            <BellOff size={48} className="mx-auto mb-4" />
            No notifications
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`border rounded-xl p-5 ${
                  n.read ? "opacity-70 border-white/10" : colorMap[n.type]
                }`}
              >
                <div className="flex gap-4">
                  {iconMap[n.type]}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-white font-semibold">{n.title}</h3>
                      <div className="flex gap-2">
                        {!n.read && (
                          <button onClick={() => markAsRead(n.id)}>
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => deleteNotification(n.id)}>
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">{n.message}</p>
                    <div className="text-xs text-gray-500 mt-2 flex gap-1 items-center">
                      <Clock size={12} />
                      {formatRelativeTime(n.timestamp)}
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
