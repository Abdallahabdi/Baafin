import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  gender: String,
  email:String,
  password: String,
  confirmPassword: String,
  Phone: Number,
  role: { type: String, default: "user" }, // admin or user
}, { timestamps: true });

export default mongoose.model("User", userSchema);
