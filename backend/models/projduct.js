import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  description: String
});

export default mongoose.model("Product", productSchema);
