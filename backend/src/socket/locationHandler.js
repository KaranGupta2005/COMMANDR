import User from "../models/User.js";

export default (io, socket) => {
  socket.on("locationUpdate", async ({ lat, lng, role }) => {
    if (!socket.userId) return;
    if (lat == null || lng == null) return;
    if (typeof lat !== "number" || typeof lng !== "number") return;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;

    await User.findByIdAndUpdate(socket.userId, {
      lastKnownLocation: { lat, lng, updatedAt: new Date() },
    });

    if (role === "victim") {
      io.to("rescue").emit("victimLocation", {
        userId: socket.userId,
        lat,
        lng,
      });
      io.to("logistics").emit("victimLocation", {
        userId: socket.userId,
        lat,
        lng,
      });
    }

    if (role === "rescue") {
      io.to("rescue").emit("rescueLocation", {
        userId: socket.userId,
        lat,
        lng,
      });
      io.to("logistics").emit("rescueLocation", {
        userId: socket.userId,
        lat,
        lng,
      });
    }
  });
};
