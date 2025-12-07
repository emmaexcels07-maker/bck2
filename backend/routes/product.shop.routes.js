import express from "express";
import { shopProducts } from "../controller/product.shop.controller.js";

const router = express.Router();

router.get("/", shopProducts);

export default router;
