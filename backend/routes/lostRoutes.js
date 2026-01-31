import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import {
  addLost,
  getLost,
  updateLost,
  deleteLost
} from "../controllers/lostController.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), addLost);
router.get("/", protect, getLost);
router.put("/:id", protect, upload.single("image"), updateLost);
router.delete("/:id", protect, deleteLost);

export default router;
