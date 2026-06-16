import Vehicle from "../models/Vehicle.js";
import ExpressError from "../middlewares/expressError.js";
import { decisionEngine } from "../engine/decisionEngine.js";
import { EVENTS } from "../constants/events.js";

export const createVehicle = async (req, res) => {
  const { type, identifier, location, capacity } = req.body;

  const existingVehicle = await Vehicle.findOne({ identifier });
  if (existingVehicle) {
    throw new ExpressError(409, "Vehicle identifier must be unique");
  }

  const vehicle = await Vehicle.create({
    type,
    identifier,
    location,
    capacity,
  });

  res.status(201).json({ success: true, data: vehicle });
};

export const getAllVehicles = async (req, res) => {
  const { status, type } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
};

export const getVehicleById = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate("assignedMissionId");
  if (!vehicle) {
    throw new ExpressError(404, "Vehicle not found");
  }
  res.status(200).json({ success: true, data: vehicle });
};

export const updateVehicle = async (req, res) => {
  const { location, status, assignedMissionId } = req.body;

  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    throw new ExpressError(404, "Vehicle not found");
  }

  if (location) vehicle.location = location;
  if (status) vehicle.status = status;
  if (assignedMissionId !== undefined) vehicle.assignedMissionId = assignedMissionId;

  await vehicle.save();

  // Trigger events based on status changes
  if (status === "in-use" && assignedMissionId) {
    await decisionEngine({
      eventType: EVENTS.VEHICLE_ALLOCATED,
      payload: {
        vehicleId: vehicle._id,
        missionId: assignedMissionId,
        message: "Vehicle allocated",
      },
      io: req.app.get("io"),
    });
  }

  if (status === "down") {
    await decisionEngine({
      eventType: EVENTS.VEHICLE_FAILURE,
      payload: {
        vehicleId: vehicle._id,
        missionId: vehicle.assignedMissionId,
        message: "Vehicle is down",
      },
      io: req.app.get("io"),
    });
  }

  res.status(200).json({ success: true, data: vehicle });
};

export const deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    throw new ExpressError(404, "Vehicle not found");
  }

  if (vehicle.status === "in-use") {
    throw new ExpressError(400, "Cannot delete a vehicle that is currently in use");
  }

  await vehicle.deleteOne();
  res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
};
