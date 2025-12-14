import express from "express";
import { auth, admin } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  adminGetOrders,
  updateOrderStatus,
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/mine", auth, getMyOrders);

router.get("/", auth, admin, adminGetOrders);
router.put("/:id", auth, admin, updateOrderStatus);

export default router;
