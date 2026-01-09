import mongoose from "mongoose";

const victimProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    emergencyCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastEmergencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergency",
      default: null,
    },

    dependentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("VictimProfile", victimProfileSchema);
