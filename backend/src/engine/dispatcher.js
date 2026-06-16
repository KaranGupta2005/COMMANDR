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
  if (!recipient?._id) return;

  const recipientId = recipient._id.toString();

  /* Dispatch via Socket.IO */
  if (channels.socket) {
    io.to(recipientId).emit("notification:new", {
      eventType,
      payload,
    });
  }

  /* Dispatch via Web Push */
  if (channels.webpush) {
    try {
      const subs = await Sub.find({ userId: recipient._id });
      if (!subs.length) return;

      const pushPayload = JSON.stringify({
        title: payload?.title || eventType.replace(/_/g, " "),
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
          // Other errors (e.g., VAPID not configured) — skip silently
        }
      }
    } catch (err) {
      console.warn("Web push dispatch failed for", recipientId, err.message);
    }
  }
};
