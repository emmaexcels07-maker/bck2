import Product from "../models/product.js";

export const shopProducts = async (req, res) => {
  try {
    const { search, category, min, max, page = 1, limit = 12 } = req.query;

    let filter = {};

    // text search
    if (search) filter.title = { $regex: search, $options: "i" };

    // category filter
    if (category) filter.category = category;

    // price filtering
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    const skip = (page - 1) * limit;

    // fetch products
    const products = await Product.find(filter)
      .populate("category")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      total,
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export default {
  shopProducts,
};