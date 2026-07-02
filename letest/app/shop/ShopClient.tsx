"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteProducts } from "../hook/useInfiniteProducts";
import ProductGrid from "../components/product/ProductGrid";
import { motion } from "framer-motion";

interface ShopClientProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ShopClient({ searchParams }: ShopClientProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement>(null);

  // Local state for smooth input experience
  type FilterState = {
    search: string;
    min: string;
    max: string;
  };

  const [localFilters, setLocalFilters] = useState<FilterState>({
    search: (typeof searchParams.search === "string" ? searchParams.search : "") || "",
    min: (typeof searchParams.min === "string" ? searchParams.min : "") || "",
    max: (typeof searchParams.max === "string" ? searchParams.max : "") || "",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts(localFilters);

  // Debounced Filter Update
  useEffect(() => {
    const handler = setTimeout(() => {
      const q = new URLSearchParams(urlSearchParams.toString());

      Object.entries(localFilters).forEach(([key, value]) => {
        const stringValue = String(value ?? "");
        if (stringValue) q.set(key, stringValue);
        else q.delete(key);
      });

      router.push(`/shop?${q.toString()}`);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(handler);
  }, [localFilters, router, urlSearchParams]);

  // Handle Input Changes
  const handleInputChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const products = data?.pages.flat() ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Our Store</h1>
        <p className="text-gray-500">Discover our latest collection.</p>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="Search products..."
          value={localFilters.search}
          onChange={(e) => handleInputChange("search", e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
        <input
          type="number"
          placeholder="Min price"
          value={localFilters.min}
          onChange={(e) => handleInputChange("min", e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
        <input
          type="number"
          placeholder="Max price"
          value={localFilters.max}
          onChange={(e) => handleInputChange("max", e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto">
        <ProductGrid
          products={products}
          loading={isLoading || isFetchingNextPage}
        />

        {!isLoading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No products found for these filters.</p>
          </div>
        )}

        {/* Infinite Scroll Loader */}
        <div ref={loaderRef} className="text-center py-10">
          {isFetchingNextPage ? (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              Loading more...
            </motion.div>
          ) : hasNextPage ? (
            <p className="text-gray-400">Scroll for more</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}