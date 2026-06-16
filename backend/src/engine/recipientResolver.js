import User from "../models/User.js";
import { getDistanceKm } from "../utils/geo.js";
import { EVENTS } from "../constants/events.js";

export const resolveRecipients = async (eventType, payload) => {
  const recipients = [];

  switch (eventType) {
    case EVENTS.EMERGENCY_REPORTED:
    case EVENTS.EMERGENCY_UPDATED:
    case EVENTS.EMERGENCY_ESCALATED: {
      const users = await User.find({
        role: { $in: ["rescue", "logistics"] },
        "lastKnownLocation.lat": { $ne: null },
        "lastKnownLocation.lng": { $ne: null },
      });

      for (const user of users) {
        // Logistics always gets notified
        if (user.role === "logistics") {
          recipients.push(user);
          continue;
        }

        // Rescue only if within 10km
        if (payload?.location) {
          const distance = getDistanceKm(
            user.lastKnownLocation,
            payload.location
          );
          if (distance <= 10) {
            recipients.push(user);
          }
        }
      }

      // Also notify the reporter
      if (payload?.reportedBy) {
        const victim = await User.findById(payload.reportedBy);
        if (victim) recipients.push(victim);
      }
      break;
    }

    case EVENTS.MISSION_ASSIGNED:
    case EVENTS.MISSION_ACCEPTED:
    case EVENTS.MISSION_REJECTED:
    case EVENTS.MISSION_DELAYED:
    case EVENTS.MISSION_COMPLETED: {
      if (payload?.rescueId) {
        const user = await User.findById(payload.rescueId);
        if (user) recipients.push(user);
      }

      const logistics = await User.find({ role: "logistics" });
      recipients.push(...logistics);
      break;
    }

    case EVENTS.VEHICLE_ALLOCATED:
    case EVENTS.VEHICLE_FAILURE: {
      const logistics = await User.find({ role: "logistics" });
      recipients.push(...logistics);

      if (payload?.rescueId) {
        const rescue = await User.findById(payload.rescueId);
        if (rescue) recipients.push(rescue);
      }
      break;
    }

    case EVENTS.SAFEZONE_OVERFLOW: {
      const users = await User.find({ role: "logistics" });
      recipients.push(...users);
      break;
    }

    default:
      console.warn("Unknown event type in recipientResolver:", eventType);
  }

  // Deduplicate by user ID
  const seen = new Set();
  const unique = recipients.filter((user) => {
    const id = user._id.toString();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return unique;
};
