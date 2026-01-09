import Emergency from "../models/Emergency.js";
import ExpressError from "../middlewares/expressError.js";
import { decisionEngine } from "../engine/decisionEngine.js";
import { EVENTS } from "../constants/events.js";

export const createEmergency = async (userId, data, io) => {
  const emergency = await Emergency.create({
    reportedBy: userId,
    type: data.type,
    location: data.location,
    description: data.description,
    media: data.media || [],
    severity: data.severity,
    status: "pending",
  });

  console.log("🔥 decisionEngine called for EMERGENCY_REPORTED");

  await decisionEngine({
    eventType: EVENTS.EMERGENCY_REPORTED,
    payload: {
      emergencyId: emergency._id,
      location: emergency.location,
      severity: emergency.severity,
      type: emergency.type,
      message: "New emergency reported",
      reportedBy: userId,
    },
    context: { userId },
    io,
  });

  return emergency;
};

export const getVictimEmergencies = async (userId) => {
  return Emergency.find({ reportedBy: userId }).sort({ createdAt: -1 });
};

export const getAllEmergencies = async () => {
  return Emergency.find().sort({ createdAt: -1 });
};

export const updateEmergencyStatus = async (id, status, io) => {
  const emergency = await Emergency.findById(id);
  if (!emergency) {
    throw new ExpressError(404, "Emergency not found");
  }

  emergency.status = status;
  await emergency.save();

  await decisionEngine({
    eventType: EVENTS.EMERGENCY_UPDATED,
    payload: {
      emergencyId: emergency._id,
      severity: emergency.severity,
      status: emergency.status,
      message: "Emergency updated",
    },
    io,
  });

  if (emergency.severity === "critical") {
    await decisionEngine({
      eventType: EVENTS.EMERGENCY_ESCALATED,
      payload: {
        emergencyId: emergency._id,
        location: emergency.location,
        severity: emergency.severity,
        message: "Emergency escalated",
      },
      io,
    });
  }

  return emergency;
};
