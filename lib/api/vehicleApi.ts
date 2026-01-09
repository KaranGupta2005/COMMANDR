import apiClient from "./client";
import {
  Vehicle,
  CreateVehicleData,
  UpdateVehicleData,
  ApiResponse,
} from "@/types";

export const vehicleApi = {
  // Create vehicle
  create: async (data: CreateVehicleData): Promise<Vehicle> => {
    const response = await apiClient.post("/vehicles/new", data);
    return response.data;
  },

  // Get all vehicles
  getAll: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get("/vehicles");
    return response.data;
  },

  // Get vehicle by ID
  getById: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  // Update vehicle
  update: async (id: string, data: UpdateVehicleData): Promise<Vehicle> => {
    const response = await apiClient.patch(`/vehicles/${id}`, data);
    return response.data;
  },

  // Delete vehicle
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },

  // Get available vehicles
  getAvailable: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get("/vehicles");
    const vehicles = response.data;
    return vehicles.filter((v: Vehicle) => v.status === "available");
  },

  // Allocate vehicle to mission
  allocate: async (
    vehicleId: string,
    missionId: string
  ): Promise<Vehicle> => {
    const response = await apiClient.patch(`/vehicles/${vehicleId}`, {
      status: "in-use",
      assignedMissionId: missionId,
    });
    return response.data;
  },

  // Mark vehicle as down
  markAsDown: async (vehicleId: string): Promise<Vehicle> => {
    const response = await apiClient.patch(`/vehicles/${vehicleId}`, {
      status: "down",
    });
    return response.data;
  },
};

export default vehicleApi;
