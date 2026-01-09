import express from "express";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { userAuth, authorize } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

router.get(
  "/nearby",
  userAuth,
  authorize(["rescue", "logistics"]),
  wrapAsync(async (req, res) => {
    const { lat, lng, radius = 50 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const rescueUsers = await User.find({
      role: "rescue",
      "lastKnownLocation.lat": { $ne: null },
      "lastKnownLocation.lng": { $ne: null },
      _id: { $ne: req.user._id } 
    }).select("fullName email lastKnownLocation createdAt");

    const nearbyTeams = rescueUsers
      .map(user => {
        const distance = calculateDistance(
          userLat,
          userLng,
          user.lastKnownLocation.lat,
          user.lastKnownLocation.lng
        );

        return {
          _id: user._id,
          name: user.fullName,
          email: user.email,
          location: `${user.lastKnownLocation.lat.toFixed(4)}, ${user.lastKnownLocation.lng.toFixed(4)}`,
          position: [user.lastKnownLocation.lat, user.lastKnownLocation.lng],
          distance: parseFloat(distance.toFixed(2)),
          status: getStatus(user.lastKnownLocation.updatedAt),
          members: 1, 
          lastUpdate: getLastUpdate(user.lastKnownLocation.updatedAt),
        };
      })
      .filter(team => team.distance <= parseFloat(radius))
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      teams: nearbyTeams,
      count: nearbyTeams.length
    });
  })
);

function getStatus(updatedAt) {
  if (!updatedAt) return "offline";
  
  const now = new Date();
  const lastUpdate = new Date(updatedAt);
  const minutesSinceUpdate = (now - lastUpdate) / (1000 * 60);
  
  if (minutesSinceUpdate < 5) return "available";
  if (minutesSinceUpdate < 15) return "available";
  return "offline";
}

function getLastUpdate(updatedAt) {
  if (!updatedAt) return "Never";
  
  const now = new Date();
  const lastUpdate = new Date(updatedAt);
  const minutesSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60));
  
  if (minutesSinceUpdate < 1) return "Just now";
  if (minutesSinceUpdate < 60) return `${minutesSinceUpdate} min ago`;
  
  const hoursSinceUpdate = Math.floor(minutesSinceUpdate / 60);
  if (hoursSinceUpdate < 24) return `${hoursSinceUpdate} hour${hoursSinceUpdate > 1 ? 's' : ''} ago`;
  
  const daysSinceUpdate = Math.floor(hoursSinceUpdate / 24);
  return `${daysSinceUpdate} day${daysSinceUpdate > 1 ? 's' : ''} ago`;
}

export default router;