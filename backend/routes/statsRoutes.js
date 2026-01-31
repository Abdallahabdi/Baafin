import express from "express";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import Match from "../models/Match.js";
import Return from "../models/Return.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get monthly stats for dashboard (accessible to all authenticated users)
router.get("/monthly", protect, async (req, res) => {
  try {
    // Read optional query params for date filtering
    const start = req.query.start ? new Date(req.query.start) : new Date(new Date().setMonth(new Date().getMonth() - 5));
    const end = req.query.end ? new Date(req.query.end) : new Date();

    // Calculate months between start and end
    const months = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      months.push({ year: current.getFullYear(), month: current.getMonth() + 1 });
      current.setMonth(current.getMonth() + 1);
    }

    const data = await Promise.all(
      months.map(async ({ year, month }) => {
        const lost = await LostItem.countDocuments({
          createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
        });
        const found = await FoundItem.countDocuments({
          createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
        });
        const matches = await Match.countDocuments({
          createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
        });
        const returned = await Return.countDocuments({
          createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
        });
        const users = await User.countDocuments({
          createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
        });

        return {
          label: `${year}-${month.toString().padStart(2, "0")}`,
          lost,
          found,
          matches,
          returned,
          users,
        };
      })
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch monthly stats" });
  }
});

export default router;