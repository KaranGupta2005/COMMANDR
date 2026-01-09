import express from "express";
import {
    createSafeZone,
    getAllSafeZones,
    getSafeZoneById,
    updateSafeZone,
    deleteSafeZone,
} from "../controllers/safeZoneController.js";

import { userAuth, authorize } from "../middlewares/authMiddleware.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";

const router = express.Router();

// Get all safe zones (Can be filtered by status or location in query params)
router.get("/", userAuth, wrapAsync(getAllSafeZones));

// Get single safe zone details
router.get("/:id", userAuth, wrapAsync(getSafeZoneById));


// Create New Safe Zone -> Only Logistics (Command Center)
router.post(
    "/",
    userAuth,
    authorize(["logistics"]),
    wrapAsync(createSafeZone)
);

// Update Safe Zone (Status, Occupancy, Facilities) -> Logistics & Rescue
router.put(
    "/:id",
    userAuth,
    authorize(["logistics", "rescue"]),
    wrapAsync(updateSafeZone)
);

// Delete Safe Zone -> Only Logistics
router.delete(
    "/:id",
    userAuth,
    authorize(["logistics"]),
    wrapAsync(deleteSafeZone)
);

export default router;