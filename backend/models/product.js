import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  description: String,
  featured: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);


