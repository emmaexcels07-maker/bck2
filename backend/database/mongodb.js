import mongoose from "mongoose";
import { DB_URL } from "../config/env.js";


export const ConnectMongodb = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
   }
};
