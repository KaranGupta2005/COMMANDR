import Vehicle from "../models/Vehicle.js";
import { decisionEngine } from "../engine/decisionEngine.js";
import { EVENTS } from "../constants/events.js";

export const createVehicle = async (req, res) => {
  try {
    const { type, identifier, location, capacity } = req.body;

    const existingVehicle = await Vehicle.findOne({ identifier });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle identifier must be unique." });
    }

    const vehicle = await Vehicle.create({
      type,
      identifier,
      location,
      capacity,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("assignedMissionId");
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { location, status, assignedMissionId } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (location) vehicle.location = location;
    if (status) vehicle.status = status;
    if (assignedMissionId !== undefined)
      vehicle.assignedMissionId = assignedMissionId;

    await vehicle.save();

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

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await vehicle.deleteOne();

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
