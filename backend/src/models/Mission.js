import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
  {
    emergencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergency",
      required: true,
      index: true,
    },

    rescueTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    vehiclesAssigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],

    route: {
      type: mongoose.Schema.Types.Mixed, // polyline / geojson / array
    },

    status: {
      type: String,
      enum: ["pending", "enroute", "active", "completed", "cancelled"],
      default: "pending",
      index: true,
    },

    eta: {
      type: Date,
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mission", missionSchema);
