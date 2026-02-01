// models/CallSession.js
import mongoose from "mongoose";

const callSessionSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, index: true },
  tagType: { type: String, required: true },

  fromE164: { type: String, required: true },
  toE164: { type: String, required: true },

  status: {
    type: String,
    enum: ["initiated", "connected", "completed", "failed", "expired"],
    default: "initiated",
  },

  exotelCallSid: String,
  attempts: { type: Number, default: 1 },

  validUntil: { type: Date, required: true},
  startedAt: Date,
  endedAt: Date,
}, { timestamps: true });

callSessionSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("CallSession", callSessionSchema);