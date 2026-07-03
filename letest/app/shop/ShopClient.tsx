"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useInfiniteProducts } from "../hook/useInfiniteProducts";
import ProductGrid from "../components/product/ProductGrid";
import { motion } from "framer-motion";

export default function ShopClient() {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement>(null);

  const [localFilters, setLocalFilters] = useState({
    search: urlSearchParams.get("search") || "",
    min: urlSearchParams.get("min") || "",
    max: urlSearchParams.get("max") || "",
  });

  // Sync state if URL parameters change from outside (e.g. back button)
  useEffect(() => {
    setLocalFilters({
      search: urlSearchParams.get("search") || "",
      min: urlSearchParams.get("min") || "",
      max: urlSearchParams.get("max") || "",
    });
  }, [urlSearchParams]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts(localFilters);

  // Flatten pages for rendering
  const products = useMemo(() => data?.pages.flatMap((p: any) => p.products) ?? [], [data]);

  // Debounced URL update
  useEffect(() => {
    const handler = setTimeout(() => {
      const q = new URLSearchParams(window.location.search);
      Object.entries(localFilters).forEach(([key, value]) => {
        if (value) q.set(key, value);
        else q.delete(key);
      });
      router.push(`/shop?${q.toString()}`, { scroll: false });
    }, 500);
    return () => clearTimeout(handler);
  }, [localFilters, router]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Our Store</h1>
        <p className="text-gray-500">Discover our latest collection.</p>
      </div>



      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        {["search", "min", "max"].map((key) => (
          <input
            key={key}
            type={key === "search" ? "text" : "number"}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={localFilters[key as keyof typeof localFilters]}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, [key]: e.target.value }))}
            className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        ))}
      </div>

      {/* Product Display */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        ) : (
          <ProductGrid products={products} loading={isFetchingNextPage} />
        )}

        <div ref={loaderRef} className="py-10 text-center">
          {isFetchingNextPage && (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
              Loading more products...
            </motion.div>
          )}
        </div>
      </div>

      // ... at the end of your return() block, before the final closing div

      {/* Floating Home Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Link
          href="/"
          className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95"
          title="Return to Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}