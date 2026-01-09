import User from "../models/User.js";

const DISTANCE_LIMIT_KM = 5; 

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function rescueChatHandler(io, socket) {
  socket.on("rescue:join-nearby", async ({ lat, lng }) => {
    if (socket.role !== "rescue") return;
    if (lat == null || lng == null) return;

    const allRescueUsers = await User.find({
      role: "rescue",
      "lastKnownLocation.lat": { $exists: true },
      "lastKnownLocation.lng": { $exists: true },
    });

    const nearbyIds = [];

    for (const user of allRescueUsers) {
      if (!user.lastKnownLocation) continue;
      if (user._id.toString() === socket.userId) continue;

      const dist = getDistanceKm(
        lat,
        lng,
        user.lastKnownLocation.lat,
        user.lastKnownLocation.lng
      );

      if (dist <= DISTANCE_LIMIT_KM) {
        nearbyIds.push(user._id.toString());
      }
    }

    if (!nearbyIds.length) return;

    const roomId = `nearby-rescue:${nearbyIds.sort().join("-")}`;

    // Leave old room if exists
    if (socket.currentRescueRoom) {
      socket.leave(socket.currentRescueRoom);
    }

    socket.join(roomId);
    socket.currentRescueRoom = roomId;

    socket.emit("rescue:joined-room", { roomId });
  });

  socket.on("rescue:send-message", ({ message }) => {
    if (!socket.currentRescueRoom || !message) return;

    io.to(socket.currentRescueRoom).emit("rescue:new-message", {
      senderId: socket.userId,
      message,
      timestamp: new Date(),
    });
  });
};
