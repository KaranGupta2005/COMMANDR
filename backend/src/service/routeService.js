import axios from "axios";
import ExpressError from "../middlewares/expressError.js";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export const getOptimizedRoute = async ({ start, end, context = {} }) => {
  try {
    const res = await axios.post(
      `${ML_SERVICE_URL}/optimize-route`,
      {
        start_lat: start.lat,
        start_lng: start.lng,
        end_lat: end.lat,
        end_lng: end.lng,
        context,
      },
      { timeout: 30000 } // 30 second timeout for ML computation
    );

    return res.data;
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      throw new ExpressError(503, "Route optimization service is unavailable");
    }
    if (err.response) {
      throw new ExpressError(
        err.response.status || 500,
        err.response.data?.detail || "Route optimization failed"
      );
    }
    throw new ExpressError(500, "Route optimization request failed");
  }
};
