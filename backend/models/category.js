import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Category", categorySchema);
