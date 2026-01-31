import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { getAllUsers, deleteUser, getAllLostItems, getAllFoundItems } from "../controllers/adminController.js";

const router = express.Router();

// Routes for admin dashboard
router.get("/users", protect, adminOnly, getAllUsers);          // Hel dhammaan users
router.delete("/users/:id", protect, adminOnly, deleteUser);    // Delete user by ID

router.get("/lost-items", protect, adminOnly, getAllLostItems); // Hel dhammaan lost items
router.get("/found-items", protect, adminOnly, getAllFoundItems); // Hel dhammaan found items

export default router;
