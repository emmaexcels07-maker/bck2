import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // Path to your User model

dotenv.config();

const emailToPromote = "emmaexcels07@gmail.com"; // Put your email here

async function makeAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const user = await User.findOneAndUpdate(
    { email: emailToPromote },
    { role: "admin" },
    { new: true }
  );

  if (user) {
    console.log(`Success! User ${user.email} is now an admin.`);
  } else {
    console.log("User not found.");
  }
  process.exit();
}

makeAdmin();