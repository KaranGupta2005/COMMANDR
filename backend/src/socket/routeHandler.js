import { getOptimizedRoute } from "../service/routeService.js";

export default function routeHandler(io, socket) {
  socket.on("route:request", async ({ start, end, teamId }) => {
    if (!socket.userId) return;

    if (!start || !end || !Array.isArray(start) || !Array.isArray(end)) {
      socket.emit("route:error", { message: "Invalid start/end coordinates" });
      return;
    }

    try {
      const route = await getOptimizedRoute({
        start: { lat: start[0], lng: start[1] },
        end: { lat: end[0], lng: end[1] },
        context: {
          requester: socket.userId,
          teamId,
          mode: "rescue-coordination",
        },
      });

      socket.emit("route:update", route);
    } catch (err) {
      console.error("Route compute failed:", err.message);
      socket.emit("route:error", { message: err.message || "Route computation failed" });
    }
  });
}
