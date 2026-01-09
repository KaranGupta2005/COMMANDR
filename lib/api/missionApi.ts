import apiClient from "./client";
import { Mission, CreateMissionData, MissionStatus, ApiResponse } from "@/types";

export const missionApi = {
  // Create mission (Logistics)
  create: async (data: CreateMissionData): Promise<Mission> => {
    const response = await apiClient.post("/missions", data);
    return response.data.mission;
  },

  // Get my missions (Rescue)
  getMyMissions: async (): Promise<Mission[]> => {
    const response = await apiClient.get("/missions/my");
    return response.data.missions;
  },

  // Update mission status (Rescue)
  updateStatus: async (
    missionId: string,
    status: MissionStatus
  ): Promise<Mission> => {
    const response = await apiClient.patch(`/missions/${missionId}/status`, {
      status,
    });
    return response.data.mission;
  },

  // Get single mission
  getById: async (missionId: string): Promise<Mission> => {
    const response = await apiClient.get(`/missions/${missionId}`);
    return response.data;
  },

  // Get all missions (Logistics)
  getAll: async (): Promise<Mission[]> => {
    const response = await apiClient.get("/missions");
    return response.data.missions;
  },
};

export default missionApi;
