import apiClient from "./client";
import {
  Emergency,
  CreateEmergencyData,
  EmergencyStatus,
  EmergencyType,
  EmergencySeverity,
} from "@/types";

export const emergencyApi = {
  /**
   * Create new emergency (Victim only)
   * POST /api/emergencies
   */
  create: async (data: CreateEmergencyData): Promise<Emergency> => {
    const response = await apiClient.post("/emergencies", data);
    return response.data.emergency;
  },

  /**
   * Get my emergencies (Victim only)
   * GET /api/emergencies/my
   */
  getMyEmergencies: async (): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies/my");
    return response.data.emergencies;
  },

  /**
   * Get all emergencies (Rescue + Logistics)
   * GET /api/emergencies
   */
  getAll: async (): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies");
    return response.data.emergencies;
  },

  /**
   * Get single emergency by ID
   * GET /api/emergencies/:id
   */
  getById: async (id: string): Promise<Emergency> => {
    const response = await apiClient.get(`/emergencies/${id}`);
    return response.data.emergency || response.data;
  },

  /**
   * Update emergency status (Rescue)
   * PATCH /api/emergencies/:id/status
   */
  updateStatus: async (
    id: string,
    status: EmergencyStatus
  ): Promise<Emergency> => {
    const response = await apiClient.patch(`/emergencies/${id}/status`, {
      status,
    });
    return response.data.updated;
  },

  /**
   * Get emergencies by status
   */
  getByStatus: async (status: EmergencyStatus): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies");
    const emergencies = response.data.emergencies;
    return emergencies.filter((e: Emergency) => e.status === status);
  },

  /**
   * Get emergencies by severity
   */
  getBySeverity: async (severity: EmergencySeverity): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies");
    const emergencies = response.data.emergencies;
    return emergencies.filter((e: Emergency) => e.severity === severity);
  },

  /**
   * Get emergencies by type
   */
  getByType: async (type: EmergencyType): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies");
    const emergencies = response.data.emergencies;
    return emergencies.filter((e: Emergency) => e.type === type);
  },

  /**
   * Get pending emergencies (for rescue teams)
   */
  getPending: async (): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies");
    const emergencies = response.data.emergencies;
    return emergencies.filter((e: Emergency) => e.status === "pending");
  },

  /**
   * Get critical emergencies
   */
  getCritical: async (): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies");
    const emergencies = response.data.emergencies;
    return emergencies.filter((e: Emergency) => e.severity === "critical");
  },

  /**
   * Get high priority emergencies (critical + high severity)
   */
  getHighPriority: async (): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies");
    const emergencies = response.data.emergencies;
    return emergencies.filter(
      (e: Emergency) => e.severity === "critical" || e.severity === "high"
    );
  },

  /**
   * Get unassigned emergencies
   */
  getUnassigned: async (): Promise<Emergency[]> => {
    const response = await apiClient.get("/emergencies");
    const emergencies = response.data.emergencies;
    return emergencies.filter(
      (e: Emergency) => e.status === "pending" && !e.assignedMissionId
    );
  },

  /**
   * Get emergencies statistics
   */
  getStats: async (): Promise<{
    total: number;
    pending: number;
    assigned: number;
    resolved: number;
    critical: number;
    high: number;
    medium: number;
  }> => {
    const response = await apiClient.get("/emergencies");
    const emergencies = response.data.emergencies as Emergency[];

    return {
      total: emergencies.length,
      pending: emergencies.filter((e) => e.status === "pending").length,
      assigned: emergencies.filter((e) => e.status === "assigned").length,
      resolved: emergencies.filter((e) => e.status === "resolved").length,
      critical: emergencies.filter((e) => e.severity === "critical").length,
      high: emergencies.filter((e) => e.severity === "high").length,
      medium: emergencies.filter((e) => e.severity === "medium").length,
    };
  },
};

export default emergencyApi;
