"use client";

import { useState, useEffect } from "react";
import emergencyApi from "@/lib/api/emergencyApi";
import { Emergency, CreateEmergencyData } from "@/types";
import { useAuth } from "@/app/providers/AuthProvider";

export const useEmergencies = () => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch emergencies based on role
  const fetchEmergencies = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let data: Emergency[];

      if (user.role === "victim") {
        data = await emergencyApi.getMyEmergencies();
      } else {
        data = await emergencyApi.getAll();
      }

      setEmergencies(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch emergencies");
    } finally {
      setLoading(false);
    }
  };

  // Create emergency
  const createEmergency = async (data: CreateEmergencyData) => {
    setLoading(true);
    setError(null);

    try {
      const newEmergency = await emergencyApi.create(data);
      setEmergencies((prev) => [newEmergency, ...prev]);
      return newEmergency;
    } catch (err: any) {
      setError(err.message || "Failed to create emergency");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update emergency status
  const updateStatus = async (id: string, status: "pending" | "assigned" | "resolved") => {
    setLoading(true);
    setError(null);

    try {
      const updated = await emergencyApi.updateStatus(id, status);
      setEmergencies((prev) =>
        prev.map((e) => (e._id === id ? updated : e))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get emergency by ID
  const getEmergencyById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const emergency = await emergencyApi.getById(id);
      return emergency;
    } catch (err: any) {
      setError(err.message || "Failed to fetch emergency");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmergencies();
    }
  }, [user]);

  return {
    emergencies,
    loading,
    error,
    createEmergency,
    updateStatus,
    getEmergencyById,
    refetch: fetchEmergencies,
  };
};
