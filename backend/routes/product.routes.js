import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);

// Admin routes
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;
