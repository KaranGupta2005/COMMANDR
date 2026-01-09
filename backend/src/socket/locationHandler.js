import User from "../models/User.js"; // ✅ import

export default (io, socket) => {
  // ✅ export default
  socket.on("locationUpdate", async ({ lat, lng, role }) => {
    if (lat == null || lng == null) return;

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
      // ✅ ALSO emit to other rescues for nearby teams
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
