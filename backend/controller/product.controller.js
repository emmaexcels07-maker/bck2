import Product from "../models/product.js";

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json({ success: true, products });
};

export const createProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";
    const product = await Product.create({ title, price, description, image });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
