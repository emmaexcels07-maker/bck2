import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/mongodb.js";
import compression from "compression";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import shopRoutes from "./routes/product.shop.routes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(compression());

const allowedOrigins = [
  ...(process.env.CLIENT_URL?.split(",") ?? []),
  ...(process.env.FRONTEND_URL?.split(",") ?? []),
  ...(process.env.NEXT_PUBLIC_API_URL?.split(",") ?? []),
  "https://bck2-1.onrender.com",
  "https://bck2-dtr1.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS origin denied: ${origin}`));
  },
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/shop", shopRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", authRoutes); // Admin routes can be added here


app.get("/", (req, res) => {
  res.send("E-Commerce Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});