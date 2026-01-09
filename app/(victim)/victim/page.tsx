"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/AuthProvider";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse rounded-md" />
  ),
});

type EmergencyType = "flood" | "fire" | "medical" | "trapped" | "other";
type Severity = "medium" | "high" | "critical";

export default function VictimPage() {
  const { user, loading } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    type: "medical" as EmergencyType,
    severity: "medium" as Severity,
    description: "",
  });

  /* ---------- REPORT EMERGENCY ---------- */
  const reportEmergency = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await apiClient.post("/emergencies", {
            type: form.type,
            severity: form.severity,
            description: form.description,
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          });

          setSuccess("Emergency reported successfully");
          setForm({ type: "medical", severity: "medium", description: "" });
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to report emergency");
        } finally {
          setSubmitting(false);
        }
      },
      () => {
        setSubmitting(false);
        setError("Unable to fetch your location");
      }
    );
  };

  if (loading) return null;

  return (
    <main className="min-h-screen p-6 flex flex-col lg:flex-row gap-6">
      {/* MAP */}
      <div className="w-full lg:w-2/3 h-[500px] border border-gray-300 rounded-xl overflow-hidden">
        <Map />
      </div>

      {/* EMERGENCY PANEL */}
      <div className="w-full lg:w-1/3 bg-white/80 backdrop-blur border rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Report Emergency</h2>

        {error && (
          <div className="mb-3 p-3 text-sm bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 p-3 text-sm bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* TYPE */}
        <label className="block text-sm mb-1">Emergency Type</label>
        <select
          value={form.type}
          onChange={(e) =>
            setForm((f) => ({ ...f, type: e.target.value as EmergencyType }))
          }
          className="w-full mb-3 border rounded px-3 py-2"
        >
          <option value="medical">Medical</option>
          <option value="fire">Fire</option>
          <option value="flood">Flood</option>
          <option value="trapped">Trapped</option>
          <option value="other">Other</option>
        </select>

        {/* SEVERITY */}
        <label className="block text-sm mb-1">Severity</label>
        <select
          value={form.severity}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              severity: e.target.value as Severity,
            }))
          }
          className="w-full mb-3 border rounded px-3 py-2"
        >
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {/* DESCRIPTION */}
        <label className="block text-sm mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full mb-4 border rounded px-3 py-2"
          rows={3}
          placeholder="Describe the emergency..."
        />

        <Button
          onClick={reportEmergency}
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Reporting..." : "Report Emergency"}
        </Button>
      </div>
    </main>
  );
}
