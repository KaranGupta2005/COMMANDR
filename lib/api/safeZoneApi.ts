import apiClient from "./client";
import {
  SafeZone,
  CreateSafeZoneData,
  UpdateSafeZoneData,
  ApiResponse,
} from "@/types";

export const safeZoneApi = {
  // Create safe zone (Logistics)
  create: async (data: CreateSafeZoneData): Promise<SafeZone> => {
    const response = await apiClient.post("/safezones", data);
    return response.data.data;
  },

  // Get all safe zones
  getAll: async (): Promise<SafeZone[]> => {
    const response = await apiClient.get("/safezones");
    return response.data.data;
  },

  // Get safe zone by ID
  getById: async (id: string): Promise<SafeZone> => {
    const response = await apiClient.get(`/safezones/${id}`);
    return response.data.data;
  },

  // Update safe zone (Logistics + Rescue)
  update: async (id: string, data: UpdateSafeZoneData): Promise<SafeZone> => {
    const response = await apiClient.put(`/safezones/${id}`, data);
    return response.data.data;
  },

  // Delete safe zone (Logistics)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/safezones/${id}`);
  },

  // Update occupancy
  updateOccupancy: async (
    id: string,
    currentOccupancy: number
  ): Promise<SafeZone> => {
    const response = await apiClient.put(`/safezones/${id}`, {
      currentOccupancy,
    });
    return response.data.data;
  },

  // Get safe zones by status
  getByStatus: async (status: "safe" | "warning" | "unsafe"): Promise<SafeZone[]> => {
    const response = await apiClient.get("/safezones");
    const zones = response.data.data;
    return zones.filter((z: SafeZone) => z.status === status);
  },
};

export default safeZoneApi;
