import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Send route feedback to ML service after mission completion.
 * Called automatically when a mission status changes to "completed".
 */
export const sendRouteFeedback = async (mission, emergency) => {
  try {
    const payload = {
      mission_id: mission._id.toString(),
      start: emergency?.location || { lat: 0, lng: 0 },
      end: mission.route?.destination || emergency?.location || { lat: 0, lng: 0 },
      route_type: mission.route?.type || "safe",
      actual_travel_time_min: calculateTravelTime(mission),
      predicted_travel_time_min: mission.eta
        ? (new Date(mission.eta).getTime() - new Date(mission.startedAt).getTime()) / 60000
        : 15,
      road_conditions: {
        flood_reports: emergency?.type === "flood" ? 5 : 0,
        water_depth: emergency?.type === "flood" ? 30 : 0,
        traffic_speed: 25,
        visibility: 0.8,
        crowd_density: 0.3,
        blocked_segments: 0,
        segment_length: 200,
        road_type: 1,
        elevation: 220,
        is_bridge: 0,
        near_river: emergency?.type === "flood" ? 1 : 0,
        blocked: 0,
      },
      success: mission.status === "completed",
      rerouted: false,
      timestamp: new Date().toISOString(),
    };

    await axios.post(`${ML_SERVICE_URL}/feedback`, payload, { timeout: 5000 });
    console.log("✅ ML feedback sent for mission:", mission._id);
  } catch (err) {
    // Non-critical — don't crash if ML service is down
    console.warn("⚠️ ML feedback failed:", err.message);
  }
};

/**
 * Send live context snapshot from emergency reports.
 * Called when a new emergency is reported.
 */
export const sendContextFromEmergency = async (emergency) => {
  try {
    const payload = {
      source: "emergency",
      location: emergency.location,
      data: {
        elevation: 220,
        flood_reports: emergency.type === "flood" ? 8 : emergency.type === "fire" ? 2 : 1,
        traffic_speed: emergency.severity === "critical" ? 10 : 30,
        water_depth: emergency.type === "flood" ? 50 : 0,
        road_width: 5,
        visibility: emergency.type === "fire" ? 0.3 : 0.8,
        crowd_density: emergency.severity === "critical" ? 0.8 : 0.3,
        is_bridge: false,
        near_river: emergency.type === "flood",
        blocked: emergency.severity === "critical",
      },
      timestamp: new Date().toISOString(),
    };

    await axios.post(`${ML_SERVICE_URL}/context`, payload, { timeout: 5000 });
    console.log("✅ ML context sent from emergency:", emergency._id);
  } catch (err) {
    console.warn("⚠️ ML context send failed:", err.message);
  }
};

/**
 * Send context from vehicle status changes (vehicle down = blocked road).
 */
export const sendContextFromVehicle = async (vehicle, event) => {
  try {
    const payload = {
      source: "vehicle",
      location: vehicle.location,
      data: {
        elevation: 220,
        flood_reports: 0,
        traffic_speed: event === "down" ? 5 : 40,
        water_depth: 0,
        road_width: 5,
        visibility: 0.8,
        crowd_density: 0.2,
        is_bridge: false,
        near_river: false,
        blocked: event === "down",
      },
      timestamp: new Date().toISOString(),
    };

    await axios.post(`${ML_SERVICE_URL}/context`, payload, { timeout: 5000 });
  } catch (err) {
    console.warn("⚠️ ML vehicle context failed:", err.message);
  }
};

/**
 * Trigger model retraining (called periodically or manually).
 */
export const triggerRetrain = async () => {
  try {
    const res = await axios.post(`${ML_SERVICE_URL}/train`, null, {
      params: { min_samples: 50 },
      timeout: 60000, // Training can take time
    });
    console.log("🧠 ML retrain result:", res.data.status);
    return res.data;
  } catch (err) {
    console.warn("⚠️ ML retrain failed:", err.message);
    return { status: "error", reason: err.message };
  }
};

/**
 * Get ML model health and stats.
 */
export const getMLStats = async () => {
  try {
    const res = await axios.get(`${ML_SERVICE_URL}/stats`, { timeout: 5000 });
    return res.data;
  } catch (err) {
    return { status: "unavailable", reason: err.message };
  }
};

/* ========== HELPERS ========== */

function calculateTravelTime(mission) {
  if (mission.startedAt && mission.completedAt) {
    return (new Date(mission.completedAt) - new Date(mission.startedAt)) / 60000;
  }
  return 15; // default
}
