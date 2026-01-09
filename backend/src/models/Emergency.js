import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
        type: String,
        enum: ["flood","fire","trapped","medical","other"],
        required: true,
        trim: true,
        lowercase: true,
    },

    severity: {
      type: String,
      enum: ["medium", "high", "critical"],
      required: true,
      lowercase: true,
    },

    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    description: {
      type: String,
      trim: true,
    },

    media: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "assigned", "resolved"],
      default: "pending",
      index: true,
    },

    assignedMissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
    },

    verificationScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    verifiedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

emergencySchema.index({ status: 1, severity: 1 });
emergencySchema.index({ "location.lat": 1, "location.lng": 1 });

export default mongoose.model("Emergency", emergencySchema);
