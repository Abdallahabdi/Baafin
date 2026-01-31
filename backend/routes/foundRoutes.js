import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import {
  addFound,
  getFound,
  updateFound,
  deleteFound
} from "../controllers/foundController.js";

const router = express.Router();

// GET all found items
router.get("/", protect, getFound);

// ADD found item
router.post("/", protect, upload.single("image"), addFound);

// EDIT found item
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateFound
);

// DELETE found item
router.delete(
  "/:id",
  protect,
  deleteFound
);

export default router;
