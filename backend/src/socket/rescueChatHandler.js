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
    if (!socket.userId || socket.role !== "rescue") return;
    if (lat == null || lng == null) return;

    const allRescueUsers = await User.find({
      role: "rescue",
      "lastKnownLocation.lat": { $ne: null },
      "lastKnownLocation.lng": { $ne: null },
    });

    const nearbyIds = [socket.userId];

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

    if (nearbyIds.length < 2) return; // No other nearby users

    const roomId = `nearby-rescue:${nearbyIds.sort().join("-")}`;

    // Leave old room if exists
    if (socket.currentRescueRoom) {
      socket.leave(socket.currentRescueRoom);
    }

    socket.join(roomId);
    socket.currentRescueRoom = roomId;

    socket.emit("rescue:joined-room", { roomId, nearbyCount: nearbyIds.length - 1 });
  });

  socket.on("rescue:send-message", ({ message }) => {
    if (!socket.userId || !socket.currentRescueRoom) return;
    if (!message || typeof message !== "string" || !message.trim()) return;

    io.to(socket.currentRescueRoom).emit("rescue:new-message", {
      senderId: socket.userId,
      message: message.trim().slice(0, 1000), // Limit message length
      timestamp: new Date(),
    });
  });
}
