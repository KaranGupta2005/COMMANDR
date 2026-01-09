"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import missionApi from "@/lib/api/missionApi";
import { Mission, MissionStatus } from "@/types";
import { useAuth } from "@/app/providers/AuthProvider";

export function useMissions() {
  const { user } = useAuth();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchMissions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      let data: Mission[] = [];

      if (user.role === "rescue") {
        data = await missionApi.getMyMissions();
      }

      if (user.role === "logistics") {
        data = await missionApi.getAll();
      }

      setMissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch missions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE ================= */
  const createMission = async (payload: {
    emergencyId: string;
    rescueTeamId: string;
    vehiclesAssigned: string[];
    eta?: string;
  }) => {
    if (!user || user.role !== "logistics") {
      throw new Error("Only logistics can create missions");
    }

    try {
      setLoading(true);

      const res = await apiClient.post("/missions", payload);

      await fetchMissions();

      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Mission dispatch failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (missionId: string, status: MissionStatus) => {
    try {
      setLoading(true);

      const updated = await missionApi.updateStatus(missionId, status);

      setMissions((prev) =>
        prev.map((m) => (m._id === missionId ? updated : m))
      );

      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || "Status update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMissions();
  }, [user]);

  return {
    missions,
    loading,
    error,
    createMission,
    updateStatus,
    refetch: fetchMissions,
  };
}
