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

  await Product.insertMany(products);

  console.log("🎉 Sample data generated successfully!");
  mongoose.connection.close();
}

seed();
