import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("Server is running..!!");
});

await connectToDB();

app.use("/api/auth", authRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/safezones", safeZoneRoutes);
app.use("/api/subscriptions", subsRoutes);
app.use("/api/routes", routesRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  const status = typeof err.status === "number" ? err.status : 500;
  const message = err.message || "Internal Server Error";
  if (res.headersSent) return next(err);
  res.status(status).json({ message });
});

const server = http.createServer(app);

initSocket(server);

if (process.env.PUBLIC_VAPID_KEY && process.env.PRIVATE_VAPID_KEY) {
  webpush.setVapidDetails(
    "mailto:guptakaran.port@gmail.com",
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
  );
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
