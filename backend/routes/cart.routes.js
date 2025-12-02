import express from "express";
import { auth } from "../middleware/auth.js";
import { getCart, addToCart, removeFromCart, clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", auth, getCart);
router.post("/add", auth, addToCart); // { productId, quantity }
router.post("/remove", auth, removeFromCart); // { productId }
router.post("/clear", auth, clearCart);

export default router;
