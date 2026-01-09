import mongoose from "mongoose";
import { Schema } from "mongoose";

const subSchema = new Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true,
  },
  keys: { auth: String, p256dh: String },
});

const Sub = mongoose.model("Sub", subSchema);

export default Sub;
