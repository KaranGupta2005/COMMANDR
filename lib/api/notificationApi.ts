import apiClient from "./client";
import { PushSubscription, SendNotificationData } from "@/types";

export const notificationApi = {
  // Subscribe to push notifications
  subscribe: async (subscription: PushSubscription): Promise<void> => {
    await apiClient.post("/subscriptions/subscribe", subscription);
  },

  // Send notification (Logistics only)
  send: async (data: SendNotificationData): Promise<void> => {
    await apiClient.post("/subscriptions/notify", data);
  },

  // Unsubscribe (if needed)
  unsubscribe: async (endpoint: string): Promise<void> => {
    await apiClient.post("/subscriptions/unsubscribe", { endpoint });
  },
};

export default notificationApi;
