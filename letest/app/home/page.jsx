"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LogoutButton from "../components/LogoutButton";
import { getToken } from "../lib/auth.js";

const API_URL = "https://bck2-dtr1.onrender.com/api";


export default function HomePage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const token = getToken();
    if (!token) router.replace("/signin");
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [catsRes, productsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/products?featured=true`),
        ]);

        const catsData = await catsRes.json();
        const featData = await productsRes.json();

        if (catsData.success) setCategories(catsData.categories);
        if (featData.success) setFeatured(featData.products);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      }
    }

    loadData();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 flex justify-end">
        <LogoutButton />
      </div>


      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-blue-600 text-white py-20 px-6 text-center shadow-lg"
      >
        <h1 className="text-5xl font-bold mb-4">Welcome to ShopEase</h1>
        <p className="text-xl mb-6">Find the best deals on your favorite products.</p>


        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/shop")}
          className="px-6 py-3 bg-white text-blue-600 rounded-lg text-lg font-semibold shadow-lg"
        >
          Start Shopping
        </motion.button>
      </motion.section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition"
            >
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold mt-4">{product.title}</h3>
              <p className="text-blue-600 font-bold mt-2">${product.price}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* CATEGORIES */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-600">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => router.push(`/page?category=${cat.slug}`)}
              className="bg-white p-6 shadow-lg rounded-lg cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition"
            >
              <h3 className="text-xl font-semibold">{cat.name}</h3>
              <p className="text-gray-900 mt-2">{cat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
