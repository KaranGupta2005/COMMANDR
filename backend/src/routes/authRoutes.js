import express from "express";

import {
  signup,
  login,
  logout,
  refreshToken,
} from "../controllers/authController.js";

import { userAuth, authorize } from "../middlewares/authMiddleware.js";
import {
  validateUserSignUp,
  validateUserLogin,
} from "../middlewares/validate.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";

const router = express.Router();

/* auth */

router.post("/signup", validateUserSignUp, wrapAsync(signup));
router.post("/login", validateUserLogin, wrapAsync(login));
router.post("/refresh", wrapAsync(refreshToken));
router.post("/logout", userAuth, wrapAsync(logout));

/* common user */

router.get(
  "/me",
  userAuth,
  wrapAsync((req, res) => {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
      },
    });
  })
);

/* role based */

router.get(
  "/victim",
  userAuth,
  authorize(["victim"]),
  wrapAsync((req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Victim",
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        role: req.user.role,
      },
    });
  })
);

router.get(
  "/rescue",
  userAuth,
  authorize(["rescue"]),
  wrapAsync((req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Rescue Team",
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        role: req.user.role,
      },
    });
  })
);

router.get(
  "/logistics",
  userAuth,
  authorize(["logistics"]),
  wrapAsync((req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Command Center",
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        role: req.user.role,
      },
    });
  })
);

export default router;
