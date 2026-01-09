import apiClient from "./client";
import {
  User,
  LoginCredentials,
  SignupData,
  AuthResponse,
} from "@/types";

export const authApi = {
  /**
   * User Signup
   * POST /api/auth/signup
   */
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  },

  /**
   * User Login
   * POST /api/auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * User Logout
   * POST /api/auth/logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  /**
   * Refresh Access Token
   * POST /api/auth/refresh
   */
  refreshToken: async (): Promise<void> => {
    await apiClient.post("/auth/refresh");
  },

  /**
   * Get Current User
   * GET /api/auth/me
   */
  me: async (): Promise<{ success: boolean; user: User }> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  /**
   * Get Victim Dashboard Data
   * GET /api/auth/victim
   */
  getVictimData: async (): Promise<any> => {
    const response = await apiClient.get("/auth/victim");
    return response.data;
  },

  /**
   * Get Rescue Dashboard Data
   * GET /api/auth/rescue
   */
  getRescueData: async (): Promise<any> => {
    const response = await apiClient.get("/auth/rescue");
    return response.data;
  },

  /**
   * Get Logistics Dashboard Data
   * GET /api/auth/logistics
   */
  getLogisticsData: async (): Promise<any> => {
    const response = await apiClient.get("/auth/logistics");
    return response.data;
  },

  /**
   * Update User Profile (if needed in future)
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch(`/auth/profile/${userId}`, data);
    return response.data.user;
  },

  /**
   * Change Password (if needed in future)
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },
};

export default authApi;
