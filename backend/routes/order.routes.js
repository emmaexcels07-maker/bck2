import express from "express";
import { auth, adminOnly } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  adminGetOrders,
  updateOrderStatus,
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/mine", auth, getMyOrders);

router.get("/", auth, adminOnly, adminGetOrders);
router.put("/:id", auth, adminOnly, updateOrderStatus);

export default router;
