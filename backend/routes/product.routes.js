import express from "express";
import multer from "multer";
import { auth, adminOnly } from "../middlewares/auth.middleware.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import upload from "../middlewares/upload.js";
import { upload } from '../config/cloudinary.js';

const upload = multer({ dest: 'uploads/' }); // Files stored locally
const router = express.Router();

// Public routes
router.get("/", getProducts);

// Only logged in sellers can add products
router.post('/', protect, authorizeSeller, upload.single('image'), createProduct);

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
