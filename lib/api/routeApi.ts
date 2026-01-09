import apiClient from "./client";
import { Location } from "@/types";

interface OptimizeRouteData {
  start: Location;
  end: Location;
  context?: any;
}

export const routeApi = {
  // Optimize route
  optimize: async (data: OptimizeRouteData): Promise<any> => {
    const response = await apiClient.post("/routes/optimize", {
      start_lat: data.start.lat,
      start_lng: data.start.lng,
      end_lat: data.end.lat,
      end_lng: data.end.lng,
      context: data.context,
    });
    return response.data;
  },
};

export default routeApi;
