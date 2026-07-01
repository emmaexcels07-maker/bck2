#!/usr/bin/env node
import dotenv from "dotenv";
import connectDB from "../database/mongodb.js";
import Auth from "../models/auth.model.js";
import readline from "readline";

dotenv.config();

const email = process.argv[2];

if (!email) {
    console.error("Usage: node scripts/set-admin.js <email>");
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function run() {
    await connectDB();
    try {
        const user = await Auth.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.error("❌ User not found:", email);
            process.exit(1);
        }

        if (user.role === "admin") {
            console.log("✅ User is already an admin.");
            process.exit(0);
        }

        // Add a safety check before modification
        rl.question(`Are you sure you want to promote ${email} to admin? (y/N): `, async (answer) => {
            if (answer.toLowerCase() === 'y') {
                user.role = "admin";
                await user.save();
                console.log("🚀 Success: User promoted to admin.");
            } else {
                console.log("🚫 Operation cancelled.");
            }
            process.exit(0);
        });

    } catch (err) {
        console.error("❌ Error setting admin:", err.message);
        process.exit(1);
    }
}

run();