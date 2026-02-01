
import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema({
  callSessionId: { type: mongoose.Schema.Types.ObjectId, ref: "CallSession" },
  event: String,
  duration: Number,
  payload: Object,
}, { timestamps: true });

export default mongoose.model("CallLog", callLogSchema);
