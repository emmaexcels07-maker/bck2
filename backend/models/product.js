import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    image: String,
    featured: Boolean
  },
  { timestamps: true }
);

/* 🔥 THIS GOES HERE */
productSchema.index({
  title: "text",
  category: 1,
  price: 1
});

export default mongoose.model("Product", productSchema);



