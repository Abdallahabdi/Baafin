import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register function 
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
// Hubi in email uusan horey u jirin
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already exists" });
// Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
// Abuur user cusub
  const user = await User.create({ username, email, password: hashedPassword });
// Samee token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
// Jawaab celin
  res.status(201).json({ token });
};
// Login function anaa ku daray
export const login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Hel user by email or username
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
};

// Get current user profile (for /me route)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.username = username || user.username;
  user.email = email || user.email;
  await user.save();
  res.json({ message: "Profile updated successfully" });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password changed successfully" });
};