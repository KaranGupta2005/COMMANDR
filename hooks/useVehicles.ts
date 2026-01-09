"use client";

import { useState, useEffect } from "react";
import vehicleApi from "@/lib/api/vehicleApi";
import { Vehicle, CreateVehicleData, UpdateVehicleData } from "@/types";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await vehicleApi.getAll();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Create vehicle
  const createVehicle = async (data: CreateVehicleData) => {
    setLoading(true);
    setError(null);

    try {
      const newVehicle = await vehicleApi.create(data);
      setVehicles((prev) => [...prev, newVehicle]);
      return newVehicle;
    } catch (err: any) {
      setError(err.message || "Failed to create vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update vehicle
  const updateVehicle = async (id: string, data: UpdateVehicleData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await vehicleApi.update(id, data);
      setVehicles((prev) => prev.map((v) => (v._id === id ? updated : v)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await vehicleApi.delete(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Allocate vehicle to mission
  const allocateVehicle = async (vehicleId: string, missionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await vehicleApi.allocate(vehicleId, missionId);
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? updated : v))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to allocate vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark vehicle as down
  const markAsDown = async (vehicleId: string) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await vehicleApi.markAsDown(vehicleId);
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? updated : v))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to mark vehicle as down");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get available vehicles
  const getAvailableVehicles = () => {
    return vehicles.filter((v) => v.status === "available");
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    allocateVehicle,
    markAsDown,
    getAvailableVehicles,
    refetch: fetchVehicles,
  };
};
