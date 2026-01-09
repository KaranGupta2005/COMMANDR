import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // ambulance, truck, boat, drone
    },

    identifier: {
      type: String, // vehicle number / call sign
      required: true,
      unique: true,
      trim: true,
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

    capacity: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "in-use", "down"],
      default: "available",
      index: true,
    },

    assignedMissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

vehicleSchema.index({ status: 1 });
vehicleSchema.index({ "location.lat": 1, "location.lng": 1 });

export default mongoose.model("Vehicle", vehicleSchema);
