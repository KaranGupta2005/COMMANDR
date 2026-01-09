import mongoose from "mongoose";

const logisticsProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    currentMissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LogisticsProfile", logisticsProfileSchema);
