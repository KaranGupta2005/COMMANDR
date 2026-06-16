import express from "express";
import { userAuth, authorize } from "../middlewares/authMiddleware.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { triggerRetrain, getMLStats } from "../service/mlFeedbackService.js";

const router = express.Router();

// Get ML model stats (logistics only)
router.get(
  "/stats",
  userAuth,
  authorize(["logistics"]),
  wrapAsync(async (req, res) => {
    const stats = await getMLStats();
    res.json({ success: true, data: stats });
  })
);

// Trigger model retraining (logistics only)
router.post(
  "/retrain",
  userAuth,
  authorize(["logistics"]),
  wrapAsync(async (req, res) => {
    const result = await triggerRetrain();
    res.json({ success: true, data: result });
  })
);

export default router;
