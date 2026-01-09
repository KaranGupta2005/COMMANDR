import Mission from "../models/Mission.js";
import Emergency from "../models/Emergency.js";
import Vehicle from "../models/Vehicle.js";
import ExpressError from "../middlewares/expressError.js";
import { decisionEngine } from "../engine/decisionEngine.js";
import { EVENTS } from "../constants/events.js";

export const createMission = async (data, io) => {
  const emergency = await Emergency.findById(data.emergencyId);
  if (!emergency) {
    throw new ExpressError(404, "Emergency not found");
  }

  if (emergency.status !== "pending") {
    throw new ExpressError(
      400,
      "Mission can be created only for pending emergencies"
    );
  }

  const mission = await Mission.create({
    emergencyId: data.emergencyId,
    rescueTeamId: data.rescueTeamId,
    vehiclesAssigned: data.vehiclesAssigned || [],
    route: data.route,
    eta: data.eta,
  });

  emergency.status = "assigned";
  emergency.assignedMissionId = mission._id;
  await emergency.save();

  await decisionEngine({
    eventType: EVENTS.MISSION_ASSIGNED,
    payload: {
      missionId: mission._id,
      rescueId: data.rescueTeamId,
      emergencyId: emergency._id,
      severity: emergency.severity,
      message: "Mission assigned",
    },
    io,
  });

  if (data.vehiclesAssigned?.length) {
    await Vehicle.updateMany(
      { _id: { $in: data.vehiclesAssigned } },
      { status: "in-use", assignedMissionId: mission._id }
    );

    await decisionEngine({
      eventType: EVENTS.VEHICLE_ALLOCATED,
      payload: {
        missionId: mission._id,
        vehicleIds: data.vehiclesAssigned,
        message: "Vehicles allocated to mission",
      },
      io,
    });
  }

  return mission;
};

export const getRescueMissions = async (rescueUserId) => {
  return Mission.find({ rescueTeamId: rescueUserId })
    .populate("emergencyId")
    .sort({ createdAt: -1 });
};

export const updateMissionStatus = async (missionId, status, io) => {
  const mission = await Mission.findById(missionId);
  if (!mission) {
    throw new ExpressError(404, "Mission not found");
  }

  mission.status = status;

  if (status === "enroute") {
    mission.startedAt = new Date();
  }

  if (status === "completed") {
    mission.completedAt = new Date();

    await Emergency.findByIdAndUpdate(mission.emergencyId, {
      status: "resolved",
    });

    await Vehicle.updateMany(
      { assignedMissionId: mission._id },
      { status: "available", assignedMissionId: null }
    );

    await decisionEngine({
      eventType: EVENTS.MISSION_COMPLETED,
      payload: {
        missionId: mission._id,
        emergencyId: mission.emergencyId,
        message: "Mission completed successfully",
      },
      io,
    });
  }

  if (status === "rejected") {
    await decisionEngine({
      eventType: EVENTS.MISSION_REJECTED,
      payload: {
        missionId: mission._id,
        rescueId: mission.rescueTeamId,
        message: "Mission rejected",
      },
      io,
    });
  }

  if (status === "delayed") {
    await decisionEngine({
      eventType: EVENTS.MISSION_DELAYED,
      payload: {
        missionId: mission._id,
        message: "Mission delayed",
      },
      io,
    });
  }

  await mission.save();
  return mission;
};
