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
        lastKnownLocation: { $exists: true },
      });

      for (const user of users) {
        if (user.role === "logistics") {
          recipients.push(user);
          continue;
        }

        const distance = getDistanceKm(
          user.lastKnownLocation,
          payload.location,
        );
        if (distance <= 10) {
          recipients.push(user);
        }
      }
      if (payload.reportedBy) {
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
      const user = await User.findById(payload.rescueId);
      if (user) {
        recipients.push(user);
      }

      const logistics = await User.find({
        role: "logistics",
      });
      recipients.push(...logistics);

      break;
    }

    case EVENTS.VEHICLE_ALLOCATED:
    case EVENTS.VEHICLE_FAILURE: {
      const logistics = await User.find({ role: "logistics" });
      recipients.push(...logistics);

      if (payload.rescueId) {
        const rescue = await User.findById(payload.rescueId);
        if (rescue) {
          recipients.push(rescue);
        }
      }
      break;
    }

    case EVENTS.SAFEZONE_OVERFLOW: {
      const users = await User.find({ role: "logistics" });
      recipients.push(...users);
      break;
    }
  }

  console.log(
    "🎯 recipients:",
    recipients.map((u) => ({
      id: u._id.toString(),
      role: u.role,
    })),
  );

  return recipients;
};
