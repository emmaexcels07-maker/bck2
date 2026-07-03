import express from "express";
import { Signin, Signup, Me } from "../controller/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/signin", Signin);
router.get("/me", auth, Me);

export default router;
