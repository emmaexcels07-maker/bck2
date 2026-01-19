import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    stock: { type: Number, default: 0 },
    image: {
      url: String,
      public_id: String
    },
    images: [String],
    featured: Boolean,
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

/* 🔥 TEXT SEARCH INDEX */
productSchema.index({
  name: "text",
  description: "text",
  category: 1,
  price: 1
});

export default mongoose.model("Product", productSchema);



