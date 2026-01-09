import SafeZone from "../models/SafeZone.js";
import { decisionEngine } from "../engine/decisionEngine.js";
import { EVENTS } from "../constants/events.js";

export const createSafeZone = async (req, res) => {
  const { name, location, capacity, facilities } = req.body;

  const zone = await SafeZone.create({
    name,
    location,
    capacity,
    facilities,
    lastUpdatedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: zone,
  });
};

export const getAllSafeZones = async (req, res) => {
  const zones = await SafeZone.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: zones.length,
    data: zones,
  });
};

export const getSafeZoneById = async (req, res) => {
  const zone = await SafeZone.findById(req.params.id).populate(
    "lastUpdatedBy",
    "fullName email role"
  );

  if (!zone) {
    throw new Error("Safe Zone not found");
  }

  res.status(200).json({
    success: true,
    data: zone,
  });
};

export const updateSafeZone = async (req, res) => {
  let zone = await SafeZone.findById(req.params.id);
  if (!zone) {
    throw new Error("Safe Zone not found");
  }

  const updates = {
    ...req.body,
    lastUpdatedBy: req.user._id,
  };

  if (
    updates.currentOccupancy !== undefined &&
    updates.capacity !== undefined &&
    updates.currentOccupancy > updates.capacity
  ) {
    throw new Error("Occupancy cannot exceed capacity");
  }

  zone = await SafeZone.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (zone.currentOccupancy >= zone.capacity && zone.status !== "unsafe") {
    zone.status = "unsafe";
    await zone.save();

    await decisionEngine({
      eventType: EVENTS.SAFEZONE_OVERFLOW,
      payload: {
        safeZoneId: zone._id,
        location: zone.location,
        message: "Safe zone capacity exceeded",
      },
      io: req.app.get("io"),
    });
  }

  res.status(200).json({
    success: true,
    data: zone,
  });
};

export const deleteSafeZone = async (req, res) => {
  const zone = await SafeZone.findById(req.params.id);
  if (!zone) {
    throw new Error("Safe Zone not found");
  }

  await zone.deleteOne();

  res.status(200).json({
    success: true,
    message: "Safe Zone deleted successfully",
  });
};
