"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react"; // FIX 1: Added import
import LogoutButton from "../components/LogoutButton";
import ProductCard from "../components/product/ProductCard";
import CartDrawer from "../components/CartDrawer"; // FIX: Ensure this is imported
import { getToken } from "../lib/auth";
import { apiFetch } from "../lib/fetch";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false); // FIX 2: Moved up

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }

    async function loadData() {
      try {
        const [catsRes, productsRes] = await Promise.all([
          apiFetch(`${API_URL}/categories`),
          apiFetch(`${API_URL}/products?featured=true`),
        ]);

        // FIX 3: Check if responses are OK before parsing JSON
        if (!catsRes.ok || !productsRes.ok) {
          throw new Error("Network response was not ok");
        }

        const catsData = await catsRes.json();
        const featData = await productsRes.json();

        if (catsData.success) setCategories(catsData.categories);
        if (featData.success) setFeatured(featData.products);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">Loading storefront...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">NextShop</h2>

          <div className="flex items-center gap-4">
            {/* FIX 4: Corrected Button Logic */}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2">
              <ShoppingBag className="w-6 h-6" />
            </button>
            <LogoutButton />
          </div>
        </div>
      </nav>

      // Inside your Navbar/Header component
      const [isCartOpen, setIsCartOpen] = useState(false);

      // Add to your button
      <button onClick={() => setIsCartOpen(true)} className="relative">
        <ShoppingBag />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
            {items.length}
          </span>
        )}
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-24 bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 text-white overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl font-extrabold mb-6 tracking-tight"
          >
            Curated Deals, Just for You
          </motion.h1>
          <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
            Experience a premium shopping journey with our hand-picked selection.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-white text-indigo-700 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Start Shopping
          </Link>
        </div>
      </motion.section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900">Featured</h2>
          <Link href="/shop" className="text-indigo-600 font-semibold hover:underline">View All →</Link>
        </div>

        {/* Using your reusable ProductCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat._id}
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/shop?category=${cat.slug}`)}
                className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 cursor-pointer transition-all hover:bg-indigo-50 hover:border-indigo-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-700">{cat.name}</h3>
                <p className="text-gray-600 mt-3">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}