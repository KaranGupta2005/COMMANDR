import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/VehicleController.js";
import { userAuth, authorize } from "../middlewares/authMiddleware.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { validateCreateVehicle } from "../middlewares/validate.js";

const router = express.Router();

// All vehicle routes require authentication
router.use(userAuth);

// Read — rescue & logistics can view vehicles
router.get("/", authorize(["rescue", "logistics"]), wrapAsync(getAllVehicles));
router.get("/:id", authorize(["rescue", "logistics"]), wrapAsync(getVehicleById));

// Write — only logistics can create/update/delete
router.post("/new", authorize(["logistics"]), validateCreateVehicle, wrapAsync(createVehicle));
router.patch("/:id", authorize(["logistics"]), wrapAsync(updateVehicle));
router.delete("/:id", authorize(["logistics"]), wrapAsync(deleteVehicle));

export default router;
