import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controller/product.controller.js";
import { auth, adminOnly } from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// simple local storage (dev). For production use S3/Cloudinary.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get("/getproduct", auth, adminOnly, getProducts);
router.post("/", auth, adminOnly, upload.single("image"), createProduct);
router.put("/:id", auth, adminOnly, updateProduct);
router.delete("/:id", auth, adminOnly, deleteProduct);

export default router;
