import express from "express";
import { auth, adminOnly } from "../middlewares/auth.middleware.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get("/", getProducts);

// Authenticated users can add products
router.post("/", auth, upload.single("image"), createProduct);

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
