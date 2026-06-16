import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import webpush from "web-push";

import connectToDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

import authRoutes from "./routes/authRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import safeZoneRoutes from "./routes/safeZoneRoutes.js";
import subsRoutes from "./routes/subsRouter.js";
import routesRoutes from "./routes/routesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rescueRoutes from "./routes/rescueRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & logging middleware
app.use(helmet());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "Server is running!" });
});

// Connect to database
await connectToDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/safezones", safeZoneRoutes);
app.use("/api/subscriptions", subsRoutes);
app.use("/api/routes", routesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rescue", rescueRoutes);
app.use("/api/ml", mlRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = typeof err.status === "number" ? err.status : 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${status} - ${message}`, err.stack);
  }

  if (res.headersSent) return next(err);
  res.status(status).json({ success: false, message });
});

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = initSocket(server);

// Store io instance on app for controllers to access via req.app.get("io")
app.set("io", io);

// Configure web push if VAPID keys are available
if (process.env.PUBLIC_VAPID_KEY && process.env.PRIVATE_VAPID_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL || "admin@commandr.app"}`,
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
  );
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
