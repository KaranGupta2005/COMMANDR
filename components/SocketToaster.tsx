"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";

export default function SocketToaster() {
  const { notifications } = useSocket();
  const [visible, setVisible] = useState<any | null>(null);

  useEffect(() => {
    if (!notifications.length) return;

    const latest = notifications[0];
    setVisible(latest);

    const t = setTimeout(() => setVisible(null), 4000);
    return () => clearTimeout(t);
  }, [notifications]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] bg-slate-900 border border-white/10 text-white px-5 py-4 rounded-xl shadow-2xl w-80">
      <p className="font-semibold">
        {visible.payload?.title || "Emergency Alert"}
      </p>
      <p className="text-sm text-gray-300 mt-1">
        {visible.payload?.message}
      </p>
    </div>
  );
}
