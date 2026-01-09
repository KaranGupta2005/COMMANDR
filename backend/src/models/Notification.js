import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["victim", "rescue", "logistics"],
      lowercase: true,
      default: "victim"
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["emergency", "mission", "system"],
      default: "emergency",
      lowercase: true
    },

    read: {
      type: Boolean,
      default: false
    },

    meta: {
      emergencyId: {
        type: Schema.Types.ObjectId,
        default: null
      },

      missionId: {
        type: Schema.Types.ObjectId,
        default: null
      },

      lat: {
        type: Number,
        default: null
      },

      lng: {
        type: Number,
        default: null
      },

      severity: {
        type: String,
        enum: ["medium", "high", "critical"],
        lowercase: true
      },

      deliveredVia: {
        socket: {
          type: Boolean,
          default: false
        },
        push: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
