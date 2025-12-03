import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createCheckoutSession, handleSuccess } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-checkout-session", auth, createCheckoutSession);
router.post("/success", auth, handleSuccess); // optional webhook or client confirmation

export default router;
