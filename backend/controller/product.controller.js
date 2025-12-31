import Product from "../models/product.js";
import cloudinary from "../lib/cloudinary.js";

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

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // 2️⃣ Ensure image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // 3️⃣ Extract Cloudinary image info
    const image = {
      url: req.file.path,        // Cloudinary secure_url
      public_id: req.file.filename, // Cloudinary public_id
    };

    // 4️⃣ Create product
    const product = await Product.create({
      name,
      price,
      description,
      category,
      image,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If new image uploaded → delete old one
    if (req.file) {
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await product.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
