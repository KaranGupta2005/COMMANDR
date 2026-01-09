import { getSocketId } from "../utils/socketRegistry.js";
import Sub from "../models/Sub.js";
import webpush from "web-push";

export const dispatch = async ({
  io,
  recipient,
  eventType,
  payload,
  channels,
}) => {
  const socketId = getSocketId(recipient._id);

  console.log("📨 dispatch called", {
    recipient: recipient._id.toString(),
    eventType,
    channels,
    socketId,
  });

  /* via socket */
  if (channels.socket && socketId) {
    console.log(
      "🔌 socketId for recipient:",
      recipient._id.toString(),
      getSocketId(recipient._id),
    );

    io.to(socketId).emit("notification:new", {
      eventType,
      payload,
    });
  }

  /* via webpush */
  if (channels.webpush) {
    const subs = await Sub.find({ userId: recipient._id });

    if (!subs.length) return;

    const pushPayload = JSON.stringify({
      title: payload?.title || eventType,
      message: payload?.message || "System update",
      icon: "/logo.png",
    });

    for (const sub of subs) {
      try {
        await webpush.sendNotification(sub.toJSON(), pushPayload);
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await Sub.deleteOne({ endpoint: sub.endpoint });
        }
      }
    }
  }
};
