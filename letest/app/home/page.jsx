"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import ProductCard from "../components/product/ProductCard";
import CartDrawer from "../components/CartDrawer";
import { getToken } from "../lib/auth";
import { apiFetch } from "../lib/fetch";
import Link from "next/link";
import { useCartStore } from "../lib/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://bck2-dtr1.onrender.com/api";

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState({ categories: [], featured: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCartStore()

  useEffect(() => {
    const controller = new AbortController();

    if (!getToken()) {
      router.replace("/signin");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        const [catsRes, productsRes] = await Promise.all([
          apiFetch(`${API_URL}/categories`, { signal: controller.signal }),
          apiFetch(`${API_URL}/products?featured=true`, { signal: controller.signal }),
        ]);

        if (!catsRes.ok || !productsRes.ok) throw new Error("Failed to fetch store data");

        const [catsData, featData] = await Promise.all([catsRes.json(), productsRes.json()]);

        setData({
          categories: catsData.success ? catsData.categories : [],
          featured: featData.success ? featData.products : [],
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error loading dashboard:", err);
          setError("Failed to load storefront. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
    return () => controller.abort();
  }, [router]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">NextShop</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingBag className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4">{cartItems.length}</span>
              )}
            </button>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Hero Section */}
      <motion.section className="py-24 bg-gradient-to-br from-indigo-700 to-indigo-800 text-white text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Curated Deals, Just for You</h1>
        <Link href="/shop" className="px-8 py-4 bg-white text-indigo-700 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
          Start Shopping
        </Link>
      </motion.section>

      {/* Featured Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-extrabold">Featured</h2>
          <Link href="/shop" className="text-indigo-600 font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Sub-components for cleaner code
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-indigo-600">
    <Loader2 className="w-10 h-10 animate-spin" />
    <p>Loading storefront...</p>
  </div>
);

const ErrorScreen = ({ message }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-red-500 gap-4">
    <AlertCircle className="w-12 h-12" />
    <p className="font-semibold">{message}</p>
    <button onClick={() => window.location.reload()} className="underline">Retry</button>
  </div>
);