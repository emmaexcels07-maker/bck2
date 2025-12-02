import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: Number,
  paymentIntentId: String, // Stripe PaymentIntent or session id
  status: { type: String, default: "pending" }, // pending, paid, shipped, cancelled
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
