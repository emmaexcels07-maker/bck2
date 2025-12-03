import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/mongodb.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import path from "path";
import authRoutes from "./routes/auth.routes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), '/uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);



app.get("/", (req, res) => {
  res.send("E-Commerce Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
