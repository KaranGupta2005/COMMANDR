import express from "express";
import User from "../models/User.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";

const router = express.Router();

router.get(
  "/",
  userAuth,
  wrapAsync(async (req, res) => {
    const { role } = req.query;

    const filter = {};
    if (role && ["victim", "rescue", "logistics"].includes(role)) {
      filter.role = role;
    }

    const users = await User.find(filter).select(
      "fullName email role lastKnownLocation createdAt"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  })
);

export default router;
