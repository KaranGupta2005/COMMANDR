import mongoose from "mongoose";

const safeZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      }
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0,
    },

    facilities: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    status: {
      type: String,
      enum: ["safe", "warning", "unsafe"],
      default: "safe",
      index: true,
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

safeZoneSchema.index({ status: 1 });
safeZoneSchema.index({ "location.lat": 1, "location.lng": 1 });

/* Safety Check: occupancy cannot exceed capacity */
safeZoneSchema.pre("save", function (next) {
  if (this.currentOccupancy > this.capacity) {
    return next(
      new Error("Current occupancy cannot exceed safe zone capacity")
    );
  }
  next();
});

export default mongoose.model("SafeZone", safeZoneSchema);
