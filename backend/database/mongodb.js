import mongoose from "mongoose";
import { DB_URL } from "../config/env.js";

export const connectDB = async () => {
  const uri = DB_URL || process.env.DB_URI;

  if (!uri) {
    console.warn("⚠ WARNING: No MongoDB URI provided. Skipping database connection.");
    return; // do NOT crash server
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.warn("⚠ Server will continue running WITHOUT database.");
    // DO NOT crash with process.exit(1)
  }
};

export default connectDB;
