import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/category.js";
import Product from "./models/product.js";

dotenv.config();

// ---------------------------
// MONGO CONNECTION
// ---------------------------
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔥 Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  }
}

// ---------------------------
// SAMPLE DATA
// ---------------------------
const sampleCategories = [
  { name: "Electronics", slug: "electronics", description: "Phones, laptops, gadgets" },
  { name: "Fashion", slug: "fashion", description: "Clothing & accessories" },
  { name: "Home & Kitchen", slug: "home-kitchen", description: "Home equipment" },
  { name: "Sports", slug: "sports", description: "Fitness & sports items" },
  { name: "Beauty", slug: "beauty", description: "Cosmetics & beauty products" },
  { name: "Automotive", slug: "automotive", description: "Car accessories" },
  { name: "Toys", slug: "toys", description: "Kids toys & games" },
  { name: "Office", slug: "office", description: "Office tools & supplies" },
  { name: "Health", slug: "health", description: "Healthcare items" },
  { name: "Books", slug: "books", description: "Books & stationery" },
];

// seed.js (Run inside your backend directory)
const mongoose = require("mongoose")

const Product = require("./models/Product"); 

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nextshop";

const sampleProducts = [
  {
    name: "Minimalist Wireless Headphones",
    price: 129.99,
    description: "Active noise-canceling over-ear headphones with 30-hour battery life and ultra-comfortable ear cushions.",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    stock: 20,
    featured: true,
    isPublished: true,
    rating: 4.8,
    numReviews: 34,
  },
  {
    name: "Ergonomic Mesh Office Chair",
    price: 249.50,
    description: "Breathable mesh back support with adjustable lumbar padding and armrests for long workday comfort.",
    images: ["https://images.unsplash.com/photo-1580481072645-022f9a6d1296?w=800&q=80"],
    stock: 8,
    featured: true,
    isPublished: true,
    rating: 4.6,
    numReviews: 19,
  },
  {
    name: "Smart Fitness Watch",
    price: 89.99,
    description: "Track your workouts, sleep quality, and daily steps with crisp AMOLED display and 7-day battery life.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    stock: 0, // Tests Out of Stock UI
    featured: true,
    isPublished: true,
    rating: 4.3,
    numReviews: 52,
  },
  {
    name: "Insulated Stainless Steel Bottle",
    price: 24.99,
    description: "Keep drinks ice-cold for 24 hours or piping hot for 12 hours with durable double-wall vacuum insulation.",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"],
    stock: 50,
    featured: true,
    isPublished: true,
    rating: 4.9,
    numReviews: 110,
  },
  {
    name: "RGB Mechanical Gaming Keyboard",
    price: 109.99,
    description: "Tactile mechanical switches with customizable per-key RGB lighting and detachable USB-C cable.",
    images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80"],
    stock: 15,
    featured: false,
    isPublished: true,
    rating: 4.7,
    numReviews: 28,
  },
];

// Random product titles
const sampleTitles = [
  "Wireless Headphones",
  "Smart Watch",
  "LED Desk Lamp",
  "Bluetooth Speaker",
  "Sports Water Bottle",
  "Classic Backpack",
  "Running Shoes",
  "Ceramic Cookware Set",
  "Aroma Diffuser",
  "Electric Kettle",
  "Gaming Keyboard",
  "Laptop Stand",
  "Makeup Brush Kit",
  "Children Puzzle Set",
  "Car Vacuum Cleaner",
  "Premium Notebook",
  "Yoga Mat",
  "Digital Thermometer",
  "Comfort Hoodie",
  "Noise Canceling Earbuds"
];

function getRandomImage() {
  const randomNum = Math.floor(Math.random() * 1000);
  return `https://source.unsplash.com/random/400x400?product=${randomNum}`;
}

function randomPrice() {
  return Math.floor(Math.random() * 80) + 20;
}

// ---------------------------
// SEED FUNCTION
// ---------------------------
async function seed() {
  await connectDB();

  console.log("🚨 Clearing old data...");
  await Category.deleteMany();
  await Product.deleteMany();

  console.log("🌱 Inserting categories...");
  const insertedCategories = await Category.insertMany(sampleCategories);

  console.log("🌱 Inserting sample products...");
  const products = [];

  for (let i = 0; i < 20; i++) {
    const category = insertedCategories[Math.floor(Math.random() * insertedCategories.length)];

    products.push({
      title: sampleTitles[i],
      price: randomPrice(),
      image: getRandomImage(),
      description: "This is a high-quality product you will love!",
      featured: Math.random() > 0.7, // 30% chance featured
      category: category._id,
    });
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Successfully added ${inserted.length} products to database!`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }

  await Product.insertMany(products);

  console.log("🎉 Sample data generated successfully!");
  mongoose.connection.close();
}

seed();
