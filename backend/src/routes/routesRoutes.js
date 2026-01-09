import express from "express";
import { optimizeRoute } from "../controllers/routeController.js";
import { userAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/optimize", userAuth, optimizeRoute);

export default router;
