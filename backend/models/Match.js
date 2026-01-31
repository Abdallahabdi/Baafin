import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  lostItem: { type: mongoose.Schema.Types.ObjectId, ref: "LostItem" },
  foundItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoundItem" },
  status: { type: String, default: "pending" }, // pending | confirmed | returned
}, { timestamps: true });

export default mongoose.model("Match", matchSchema);
