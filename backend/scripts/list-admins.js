// scripts/list-admins.js
import connectDB from "../database/mongodb.js";
import Auth from "../models/auth.model.js";

async function listAdmins() {
    await connectDB();
    const admins = await Auth.find({ role: "admin" });
    console.log("Current Admin Emails:");
    admins.forEach(a => console.log(`- ${a.email}`));
    process.exit(0);
}
listAdmins();