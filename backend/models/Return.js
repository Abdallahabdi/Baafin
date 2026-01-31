import mongoose from "mongoose";

// Return schema for tracking item return confirmations
const returnSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // usually admin
  status: { type: String, enum: ["requested", "confirmed", "rejected"], default: "requested" },
  confirmedAt: Date,
  notes: String
}, { timestamps: true });

export default mongoose.model("Return", returnSchema);
