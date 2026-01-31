import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Routes
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

// 1. SAXITAN CORS: Oggolow Vercel oo kaliya si amniga loo ilaaliyo
app.use(cors({
  origin: ["https://baafin.vercel.app", "http://localhost:5173"], // Ku dar localhost haddii aad tijaabinayso
  credentials: true
}));

app.use(express.json());

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. SAXITAN UPLOADS: Hubi in folder-ka uploads uu jiro ama u isticmaal path sax ah
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

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

// 3. MUHIIM: Mongoose horay ayaad ugu xirtay connectDB(), qeybtan dambe ee mongoose.connect ka saar si aysan laba jeer isku xirin.

app.get("/", (req, res) => {
    res.send("BAAFIN Platform API is running...");
});

// 4. PORT: Render wuxuu u baahan yahay inuu si dynamic ah u doorto Port-ka
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));