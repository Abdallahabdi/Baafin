import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  color:String,
  contact:Number,
  location: String,
  dateFound: Date,
  imageUrl: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("FoundItem", foundItemSchema);
