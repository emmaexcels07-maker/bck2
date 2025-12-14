"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts.ts";
import ProductCard from "../components/ProductCard.jsx";
import ProductSkeleton from "../components/ProductSkeleton.jsx";
import { useEffect, useRef } from "react";

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const loaderRef = useRef<HTMLDivElement>(null);

  const filters = {
    search: params.get("search") ?? "",
    category: params.get("category") ?? "",
    min: params.get("min") ?? "",
    max: params.get("max") ?? "",
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts(filters);

  /* ---------------- INTERSECTION OBSERVER ---------------- */
  useEffect(() => {
    if (!hasNextPage || !loaderRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fetchNextPage();
    }, { rootMargin: "200px" });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  /* ---------------- FILTER UPDATE ---------------- */
  const updateFilter = (key, value) => {
    const q = new URLSearchParams(params.toString());
    value ? q.set(key, value) : q.delete(key);
    router.push(`/shop?${q.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-xl shadow grid md:grid-cols-4 gap-4"
      >
        <input
          placeholder="Search…"
          value={filters.search}
          onChange={e => updateFilter("search", e.target.value)}
          className="p-3 rounded border"
        />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
        {data?.pages.flat().map(p => (
          <ProductCard key={p._id} product={p} />
        ))}

        {(isLoading || isFetchingNextPage) &&
          [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>

      <div ref={loaderRef} className="text-center py-10 text-gray-400">
        {hasNextPage ? "Loading more…" : "No more products"}
      </div>
    </div>
  );
}
