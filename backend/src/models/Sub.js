import mongoose from "mongoose";

const subSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
    keys: {
      auth: { type: String, required: true },
      p256dh: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Sub = mongoose.model("Sub", subSchema);

export default Sub;
