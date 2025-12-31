import Product from "../models/product";

export async function getProducts(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { search, category, min, max, featured } = req.query;

    const query = {};

    /* 🔥 FILTERS */
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (featured) query.featured = true;

    if (min || max) {
      query.price = {
        ...(min && { $gte: Number(min) }),
        ...(max && { $lte: Number(max) })
      };
    }

    /* 🔥 FAST QUERY */
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .lean(); // <-- PERFORMANCE BOOST

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      nextPage: page + 1,
      hasNextPage: skip + products.length < total
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createProduct(req, res) {
  const product = await Product.create({
    ...req.body,
    image: req.file?.path // Cloudinary URL
  });

  res.json({ success: true, product });
}

export async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ success: true, product });
}

export async function deleteProduct(req, res) {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}

