import { Router } from "express";
import { Signin, Signup } from "../controller/auth.controller.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import { JWT_SECRETE, JWT_EXPIRE_IN } from "../config/env.js";
import dotenv from "dotenv";


const router = express.Router();

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SIGN IN
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id },JWT_SECRETE, { expiresIn: JWT_EXPIRE_IN });

    res.status(200).json({ 
      
      message: "Login successful",
       token,
       user: { id: user._id, email: user.email}
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
