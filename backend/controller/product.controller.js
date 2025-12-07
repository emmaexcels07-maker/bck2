import Product from "../models/product.js";

export const getProducts = async (req, res) => {
  const now = Date.now();
  const { featured } = req.query;

  let filter = {};

  if (featured === "true") {
    filter.featured = true;
  }

  const products = await Product.find(filter).populate("category");
  
  res.json({ success: true, products });


  // return cache if data is fresh (10 seconds)
  if (cachedProducts && now - lastFetchTime < 10000) {
    return res.json({ success: true, products: cachedProducts, cached: true });
  }


  cachedProducts = products;
  lastFetchTime = now;

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
