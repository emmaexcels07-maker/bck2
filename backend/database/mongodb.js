import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database Error:", error);
    process.exit(1);
  }
};

export default connectDB;
