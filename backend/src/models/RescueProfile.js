import mongoose from "mongoose";

const rescueProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    skills: [
      {
        type: String,
        enum: ["medical", "diving", "fire"],
      },
    ],

    availabilityStatus: {
      type: String,
      enum: ["available", "on-mission", "offline"],
      default: "offline",
      index: true,
    },

    currentMissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RescueProfile", rescueProfileSchema);
