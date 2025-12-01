import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Auth from "../models/auth.model.js";
import { JWT_SECRETE, JWT_EXPIRE_IN } from "../config/env.js";



export const Signup = async (req, res, next) => {

    const seassion = await mongoose.startSession();
    seassion.startTransaction();

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
           await seassion.abortTransaction();
            seassion.endSession();
            return res.status(400).json({ message: "All fields are required" });
        }


        const isExistingUser = await Auth.findOne({ email }).session(seassion);

        if (isExistingUser) {
            await seassion.abortTransaction();
            seassion.endSession();
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await Auth.create([{
            name,
            email,
            password: hashedPassword,
        }], { session: seassion });


        await seassion.commitTransaction();
        seassion.endSession();

        return res.status(201).json({ 
            success: true,
            message: "User registered successfully",
             user: {
                id: newUser._id,
                email: newUser.email,
             }});

    } catch (error) {
    try { await seassion.abortTransaction(); } catch (_) {}
        try { seassion.endSession(); } catch (_) {}
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
}

}

export const Signin = async (req, res, next) => {


    try {
        const { email, password } = req.body;

       // check if email and password are inputted
        if (!email || !password) {
            return res.status(400).json({ message: "Fields can not be empty" });
        }

        // Validation: Is to check if the user exists already
        const user = await Auth.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRETE,
            { expiresIn: JWT_EXPIRE_IN }
        );

        return res.status(200).json({ 
            success: true,
            message: "Signin successful",
            data: {
                token: token,
            },
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
            });
    } catch (error) {
         console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }

}

export default {
    Signup,
    Signin
}