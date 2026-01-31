// controllers/adminController.js
import User from "../models/User.js";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";

// Hel dhammaan users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Ha soo celin password
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Hel dhammaan lost items
export const getAllLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find().populate("user", "name email");
    res.status(200).json(lostItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Hel dhammaan found items
export const getAllFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find().populate("user", "name email");
    res.status(200).json(foundItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
