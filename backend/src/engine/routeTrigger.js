import { getOptimizedRoute } from "../services/routeService.js";
import { EVENTS } from "../constants/events.js";

export const triggerRouteRecompute = async ({
  eventType,
  mission,
  io,
}) => {
  if (
    ![
      EVENTS.EMERGENCY_ESCALATED,
      EVENTS.VEHICLE_FAILURE,
      EVENTS.MISSION_DELAYED,
      EVENTS.SAFEZONE_OVERFLOW,
    ].includes(eventType)
  ) return;

  const route = await getOptimizedRoute({
    start: mission.currentLocation,
    end: mission.destination,
    context: mission.riskContext,
  });

  io.to(mission.rescueTeamId.toString()).emit("route:update", route);
};
