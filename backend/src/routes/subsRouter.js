import express from "express";
import { saveSubs, sendNotification } from "../controllers/subsController.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { userAuth, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/subscribe",userAuth,wrapAsync(saveSubs));
router.post(
  "/notify",
  userAuth,
  authorize(["logistics"]),
  wrapAsync(sendNotification)
);

export default router;
