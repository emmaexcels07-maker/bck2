import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getCart, addToCart, removeFromCart, clearCart } from "../controller/cart.controller.js";

const router = express.Router();

router.get("/", auth, getCart);
router.post("/add", auth, addToCart); // { productId, quantity }
router.post("/remove", auth, removeFromCart); // { productId }
router.post("/clear", auth, clearCart);

export default router;
