import express from "express";
import { getProducts, createProduct } from "../controller/product.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";

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

router.get("/getproduct", getProducts);
router.post("/createproduct", auth, upload.single("image"), createProduct);

export default router;
