export const resolveChannels = (eventType, payload) => {
  const channels = {
    socket: true,
    webpush: false,
  };

  if (payload?.severity === "critical" || payload?.severity === "high") {
    channels.webpush = true;
  }

  if (
    eventType === "VEHICLE_FAILURE" ||
    eventType === "EMERGENCY_ESCALATED" ||
    eventType === "MISSION_REJECTED"
  ) {
    channels.webpush = true;
  }

  return channels;
};
