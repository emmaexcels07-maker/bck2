import mongoose from "mongoose";
import { DB_URL } from "../config/env.js";

export const connectDB = async () => {
  const uri = DB_URL || process.env.DB_URI;

  if (!uri) {
    console.error("CRITICAL: MongoDB URI missing. Set DB_URI in your environment.");
    process.exit(1); // Force crash: Server cannot function without DB
  }

  // 1. Connection Event Listeners
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB successfully connected.");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected! Attempting to reconnect...");
  });

  // 2. Main Connection Logic
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    // In production, you might want to exit here if the DB is required
    process.exit(1); 
  }
};

export default connectDB;
