import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Auth from "../models/auth.model.js";
import { JWT_SECRETE, JWT_EXPIRE_IN } from "../config/env.js";



export const Signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // CHECK IF USER ALREADY EXISTS
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists. Please use another email.",
            });
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE USER
        const user = await Auth.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        console.error("Signup Error:", err);

        // HANDLE DUPLICATE KEY ERROR (E11000)
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "This email is already registered.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
};
export const Signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // CHECK IF USER EXISTS
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // GENERATE JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        console.error("Signin Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server error during signin",
        });
    }
};


export default {
    Signup,
    Signin
}