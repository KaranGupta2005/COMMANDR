import apiClient from "./client";
import { Location } from "@/types";

interface OptimizeRouteData {
  start: Location;
  end: Location;
  context?: Record<string, any>;
}

export const routeApi = {
  // Optimize route — backend forwards to ML service
  optimize: async (data: OptimizeRouteData): Promise<any> => {
    const response = await apiClient.post("/routes/optimize", {
      start: data.start,
      end: data.end,
      context: data.context || {},
    });
    return response.data.route;
  },
};

export default routeApi;
