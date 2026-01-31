import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    tlsAllowInvalidCertificates: true // kaliya horumarinta
    console.log("✅MongoDB Connected");
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};

