import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  color:String,
  contact:Number,
  location: String,
  dateLost: Date,
  imageUrl: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("LostItem", lostItemSchema);
