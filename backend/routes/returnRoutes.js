import express from "express";
import Return from "../models/Return.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all returns (accessible to all authenticated users)
router.get("/", protect, async (req, res) => {
  try {
    const returns = await Return.find().populate("match requestedBy confirmedBy");
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch returns" });
  }
});

export default router;
