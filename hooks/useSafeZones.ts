"use client";

import { useState, useEffect } from "react";
import safeZoneApi from "@/lib/api/safeZoneApi";
import { SafeZone, CreateSafeZoneData, UpdateSafeZoneData } from "@/types";

export const useSafeZones = () => {
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all safe zones
  const fetchSafeZones = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await safeZoneApi.getAll();
      setSafeZones(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch safe zones");
    } finally {
      setLoading(false);
    }
  };

  // Create safe zone
  const createSafeZone = async (data: CreateSafeZoneData) => {
    setLoading(true);
    setError(null);

    try {
      const newZone = await safeZoneApi.create(data);
      setSafeZones((prev) => [...prev, newZone]);
      return newZone;
    } catch (err: any) {
      setError(err.message || "Failed to create safe zone");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update safe zone
  const updateSafeZone = async (id: string, data: UpdateSafeZoneData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await safeZoneApi.update(id, data);
      setSafeZones((prev) => prev.map((z) => (z._id === id ? updated : z)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update safe zone");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete safe zone
  const deleteSafeZone = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await safeZoneApi.delete(id);
      setSafeZones((prev) => prev.filter((z) => z._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete safe zone");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update occupancy
  const updateOccupancy = async (id: string, occupancy: number) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await safeZoneApi.updateOccupancy(id, occupancy);
      setSafeZones((prev) => prev.map((z) => (z._id === id ? updated : z)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update occupancy");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get safe zones by status
  const getSafeZonesByStatus = (status: "safe" | "warning" | "unsafe") => {
    return safeZones.filter((z) => z.status === status);
  };

  useEffect(() => {
    fetchSafeZones();
  }, []);

  return {
    safeZones,
    loading,
    error,
    createSafeZone,
    updateSafeZone,
    deleteSafeZone,
    updateOccupancy,
    getSafeZonesByStatus,
    refetch: fetchSafeZones,
  };
};
