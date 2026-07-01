#!/usr/bin/env node
import dotenv from "dotenv";
import connectDB from "../database/mongodb.js";
import Auth from "../models/auth.model.js";

dotenv.config();

const email = process.argv[2];

if (!email) {
    console.error("Usage: node scripts/set-admin.js <email>");
    process.exit(1);
}

async function run() {
    await connectDB();
    try {
        const user = await Auth.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.error("User not found:", email);
            process.exit(1);
        }

        if (user.role === "admin") {
            console.log("User is already an admin:", email);
            process.exit(0);
        }

        user.role = "admin";
        await user.save();
        console.log("Success: user updated to admin:", email);
        process.exit(0);
    } catch (err) {
        console.error("Error setting admin:", err.message || err);
        process.exit(1);
    }
}

run();
