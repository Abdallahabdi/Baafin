// server.js
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

// ==========================
// 1. CORS POLICY (Production + Dev)
// ==========================
const allowedOrigins = [
  "https://baafin.vercel.app", // Production frontend
  "http://localhost:5173",      // Vite dev
  "http://localhost:3000",      // React dev
  "http://localhost:3001",
  "http://localhost:3002"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman, curl requests
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS policy does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// Preflight enable for all routes
app.options("*", cors());

// ==========================
// 2. MIDDLEWARE
// ==========================
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// ==========================
// 3. ROUTES
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/lost", lostRoutes);
app.use("/api/found", foundRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);

// ==========================
// 4. BASE ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("BAAFIN Platform API is running...");
});

// ==========================
// 5. START SERVER
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
