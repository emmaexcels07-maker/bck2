import express from "express";
import { auth, adminOnly } from "../middlewares/auth.middleware.js";
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
  auth,
  adminOnly,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  auth,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  auth,
  adminOnly,
  deleteProduct
);

export default router;
