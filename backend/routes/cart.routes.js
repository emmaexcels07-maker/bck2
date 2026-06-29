import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getCart, addToCart, removeFromCart, clearCart } from "../controller/cart.controller.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart); // { productId, quantity }
router.post("/remove", protect, removeFromCart); // { productId }
router.post("/clear", protect, clearCart);

export default router;
