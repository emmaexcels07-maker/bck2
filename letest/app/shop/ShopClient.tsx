"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, RotateCcw, Home, Loader2, PackageX } from "lucide-react";

import { useInfiniteProducts } from "../hook/useInfiniteProducts";
import ProductGrid from "../components/product/ProductGrid";

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement>(null);

  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get("search") || "",
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || "",
  });

  // Sync state if URL changes externally (e.g. browser back/forward buttons)
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const currentMin = searchParams.get("min") || "";
    const currentMax = searchParams.get("max") || "";

    setLocalFilters((prev) => {
      if (
        prev.search === currentSearch &&
        prev.min === currentMin &&
        prev.max === currentMax
      ) {
        return prev;
      }
      return { search: currentSearch, min: currentMin, max: currentMax };
    });
  }, [searchParams]);

  // Fetch infinite products based on local filters
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts(localFilters);

  // Flatten pages for rendering
  const products = useMemo(
    () => data?.pages.flatMap((p: any) => p.products) ?? [],
    [data]
  );

  // Debounced URL updates (uses router.replace to avoid clogging history stack)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();

      if (localFilters.search) params.set("search", localFilters.search);
      if (localFilters.min) params.set("min", localFilters.min);
      if (localFilters.max) params.set("max", localFilters.max);

      const queryString = params.toString();
      const newUrl = queryString ? `/shop?${queryString}` : "/shop";

      // Only update if URL actually changes
      if (`/shop?${searchParams.toString()}` !== newUrl) {
        router.replace(newUrl, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [localFilters, router, searchParams]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setLocalFilters({ search: "", min: "", max: "" });
  }, []);

  const hasActiveFilters = Boolean(
    localFilters.search || localFilters.min || localFilters.max
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Our Store
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1">
          Explore our collection with real-time filtering and search.
        </p>
      </header>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filter Products</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={localFilters.search}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min Price ($)"
            value={localFilters.min}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, min: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max Price ($)"
            value={localFilters.max}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, max: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </section>

      {/* Main Product Display Area */}
      <main className="max-w-7xl mx-auto">
        {isLoading ? (
          <ShopGridSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <PackageX className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800">No products found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your search query or price filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <ProductGrid products={products} loading={isFetchingNextPage} />
        )}

        {/* Intersection Observer Loader Anchor */}
        <div ref={loaderRef} className="py-12 flex justify-center items-center">
          {isFetchingNextPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-indigo-600 font-medium"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more items...</span>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Navigation Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link
          href="/"
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Return to Home"
          title="Return to Home"
        >
          <Home className="w-6 h-6" />
        </Link>
      </motion.div>
    </div>
  );
}

// Internal Loading Skeleton
function ShopGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
          <div className="w-full h-48 bg-slate-200 rounded-xl" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-10 bg-slate-200 rounded-xl mt-4" />
        </div>
      ))}
    </div>
  );
}