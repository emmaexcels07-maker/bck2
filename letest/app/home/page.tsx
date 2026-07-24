"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

import LogoutButton from "../components/LogoutButton";
import ProductCard from "../components/product/ProductCard";
import { Product } from "../components/types/product";
import CartDrawer from "../components/CartDrawer";
import { getToken } from "../lib/auth";
import { apiFetch } from "../lib/fetch";
import { useCartStore } from "../lib/store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://bck2-dtr1.onrender.com/api";

interface Category {
  _id: string;
  name: string;
  image?: string;
  slug?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState<{ categories: Category[]; featured: Product[] }>({
    categories: [],
    featured: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartItems } = useCartStore();

  // Calculate total item count (accounts for quantities per item)
  const totalCartCount = useMemo(() => {
    return cartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
  }, [cartItems]);

  useEffect(() => {
    const controller = new AbortController();

    if (!getToken()) {
      router.replace("/signin");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [catsRes, productsRes] = await Promise.all([
          apiFetch(`${API_BASE}/categories`, { signal: controller.signal }),
          apiFetch(`${API_BASE}/products?featured=true`, { signal: controller.signal }),
        ]);

        if (!catsRes.ok || !productsRes.ok) {
          throw new Error("Unable to fetch storefront details.");
        }

        const [catsData, featData] = await Promise.all([
          catsRes.json(),
          productsRes.json(),
        ]);

        // 📍 Option #1 Applied Correctly Here:
        // Extract array safely regardless of standard object key wrapping
        const categoriesList = Array.isArray(catsData)
          ? catsData
          : catsData.categories || catsData.data || [];

        let featuredList = Array.isArray(featData)
          ? featData
          : featData.products || featData.data || [];

        // Filter if backend returned full catalog instead of pre-filtering
        if (featuredList.length > 0) {
          const explicitFeatured = featuredList.filter(
            (p: any) => p.isFeatured || p.featured === true
          );
          // If explicit featured flags exist, use them; otherwise use the list returned
          if (explicitFeatured.length > 0) {
            featuredList = explicitFeatured;
          }
        }

        // Fallback: If no featured products exist, fetch the general catalog (limit 4)
        if (featuredList.length === 0) {
          const fallbackRes = await apiFetch(`${API_BASE}/products?limit=4`, {
            signal: controller.signal,
          });

          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            featuredList = Array.isArray(fallbackData)
              ? fallbackData
              : fallbackData.products || fallbackData.data || [];
          }
        }

        setData({
          categories: categoriesList,
          featured: featuredList,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Dashboard Loading Error:", err);
          setError("Failed to load storefront data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tight text-indigo-600 hover:opacity-90 transition-opacity">
            Next<span className="text-slate-900">Shop</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              <AnimatePresence>
                {totalCartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
                  >
                    {totalCartCount > 99 ? "99+" : totalCartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="h-5 w-px bg-slate-200" />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Error Banner */}
      {error && <ErrorBanner message={error} onRetry={() => window.location.reload()} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 via-slate-900 to-indigo-950/80 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Season Collections</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl mx-auto leading-tight"
          >
            Curated Deals, Tailored Just for You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Discover handpicked products with exclusive discounts and lightning-fast delivery right to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Categories Section */}
        {data.categories.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Shop by Category
                </h2>
                <p className="text-slate-500 text-sm mt-1">Explore top categories curated for you</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {data.categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/shop?category=${category.slug || category._id}`}
                  className="group relative p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-center"
                >
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Featured Products
              </h2>
              <p className="text-slate-500 text-sm mt-1">Top-rated items back in stock</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline group"
            >
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : data.featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {data.featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">No featured products found right now.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Inline Sub-components for Skeletons and Errors
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
          <div className="w-full h-48 bg-slate-200 rounded-xl" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-10 bg-slate-200 rounded-xl pt-2" />
        </div>
      ))}
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-red-700 text-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onRetry}
          className="font-semibold underline hover:text-red-900 transition-colors focus:outline-none"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}