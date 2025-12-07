import express from "express";
import { getCategories, createCategory } from "../controller/category.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.get("/", getCategories);

// Protected (admin) route
router.post("/", auth, createCategory);



export default router;
