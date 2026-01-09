import express from "express";
import {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
} from "../controllers/VehicleController.js";

const router = express.Router();

router.post("/new", createVehicle);
router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);
router.patch("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;