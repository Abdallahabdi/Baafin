import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import auditRoutes from "./routes/auditRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import lostRoutes from './routes/lostRoutes.js';
import foundRoutes from "./routes/foundRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// public folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/auth", authRoutes);
app.use('/api/lost', lostRoutes);
app.use("/api/found", foundRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Example route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
