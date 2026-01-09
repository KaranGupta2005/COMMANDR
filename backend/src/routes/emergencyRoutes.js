import express from "express";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { userAuth, authorize } from "../middlewares/authMiddleware.js";
import { validateCreateEmergency } from "../middlewares/validate.js";

import {
  reportEmergency,
  getMyEmergencies,
  fetchAllEmergencies,
  changeEmergencyStatus,
} from "../controllers/emergencyController.js";

const router = express.Router();

/* Victim – report*/
router.post(
  "/",
  userAuth,
  authorize(["victim"]),
  validateCreateEmergency,
  wrapAsync(reportEmergency)
);

/* Victim - view */
router.get(
  "/my",
  userAuth,
  authorize(["victim"]),
  wrapAsync(getMyEmergencies)
);

/* Rescue + Logistics */
router.get(
  "/",
  userAuth,
  authorize(["rescue", "logistics"]),
  wrapAsync(fetchAllEmergencies)
);

/* Rescue -update status */
router.patch(
  "/:id/status",
  userAuth,
  authorize(["rescue"]),
  wrapAsync(changeEmergencyStatus)
);

export default router;
