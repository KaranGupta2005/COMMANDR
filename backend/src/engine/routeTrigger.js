import { getOptimizedRoute } from "../service/routeService.js";
import { EVENTS } from "../constants/events.js";

export const triggerRouteRecompute = async ({ eventType, mission, io }) => {
  if (!mission || !io) return;

  const triggerEvents = [
    EVENTS.EMERGENCY_ESCALATED,
    EVENTS.VEHICLE_FAILURE,
    EVENTS.MISSION_DELAYED,
    EVENTS.SAFEZONE_OVERFLOW,
  ];

  if (!triggerEvents.includes(eventType)) return;

  if (!mission.currentLocation || !mission.destination) {
    console.warn("Route recompute skipped: missing location data");
    return;
  }

  try {
    const route = await getOptimizedRoute({
      start: mission.currentLocation,
      end: mission.destination,
      context: mission.riskContext || {},
    });

    io.to(mission.rescueTeamId.toString()).emit("route:update", route);
  } catch (err) {
    console.error("Route recompute failed:", err.message);
  }
};
