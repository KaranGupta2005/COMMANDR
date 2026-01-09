import express from "express";
import User from "../models/User.js";
import { userAuth , authorize } from "../middlewares/authMiddleware.js";   

const router = express.Router();

router.get("/", userAuth, authorize(["logistics", "rescue" , 'victim']), async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

export default router;
