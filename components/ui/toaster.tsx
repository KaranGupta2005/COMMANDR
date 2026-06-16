"use client";

import { useEffect, useState } from "react";

type Toast = {
  id: string;
  title: string;
  description?: string;
};

export function Toaster({ toasts }: { toasts: Toast[] }) {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    if (!toasts.length) return;

    const latest = toasts[0];
    setItems((prev) => [latest, ...prev]);

    const timer = setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== latest.id));
    }, 4000);

    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3">
      {items.map((toast) => (
        <div
          key={toast.id}
          className="bg-slate-900 border border-white/10 text-white px-5 py-4 rounded-xl shadow-2xl w-80 animate-in slide-in-from-top-2"
        >
          <p className="font-semibold">{toast.title}</p>
          {toast.description && (
            <p className="text-sm text-gray-300 mt-1">
              {toast.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
