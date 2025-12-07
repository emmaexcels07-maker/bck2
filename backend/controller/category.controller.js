import Category from "../models/category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    const exists = await Category.findOne({ slug });
    if (exists) return res.json({ success: false, message: "Category already exists." });

    const category = await Category.create({ name, slug, description });

    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
