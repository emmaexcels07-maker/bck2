"use client";

import { useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteProducts } from "../hook/useInfiniteProducts";
import ProductGrid from "../components/product/ProductGrid";

interface ShopClientProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ShopClient({ searchParams }: ShopClientProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams(); // ✅ URLSearchParams
  const loaderRef = useRef<HTMLDivElement>(null);

  // ✅ Safely normalize filters
  const filters = {
    search: typeof searchParams.search === "string" ? searchParams.search : "",
    category: typeof searchParams.category === "string" ? searchParams.category : "",
    min: typeof searchParams.min === "string" ? searchParams.min : "",
    max: typeof searchParams.max === "string" ? searchParams.max : "",
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts(filters);

  // ✅ Infinite scroll
  useEffect(() => {
  if (!hasNextPage || !loaderRef.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { rootMargin: "200px" }
  );

  observer.observe(loaderRef.current);
  return () => observer.disconnect();
}, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // ✅ URL updates must use URLSearchParams
  const updateFilter = (key: string, value: string) => {
    const q = new URLSearchParams(urlSearchParams.toString());
    <div className="mb-6 flex flex-wrap gap-4">
  <input
    placeholder="Search products..."
    defaultValue={filters.search}
    onChange={(e) => updateFilter("search", e.target.value)}
    className="px-4 py-2 rounded bg-gray-800 text-white"
  />

  <input
    type="number"
    placeholder="Min price"
    onChange={(e) => updateFilter("min", e.target.value)}
    className="px-4 py-2 rounded bg-gray-800 text-white"
  />

  <input
    type="number"
    placeholder="Max price"
    onChange={(e) => updateFilter("max", e.target.value)}
    className="px-4 py-2 rounded bg-gray-800 text-white"
  />
</div>

    value ? q.set(key, value) : q.delete(key);
    router.push(`/shop?${q.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <ProductGrid
        products={data?.pages.flat() ?? []}
        loading={isLoading || isFetchingNextPage}
      />

      <div ref={loaderRef} className="text-center py-10 text-gray-400">
        {hasNextPage ? "Loading more…" : "No more products"}
      </div>
      {!isLoading && data?.pages.flat().length === 0 && (
  <p className="text-center text-gray-400 mt-20">
    No products found.
  </p>
)}
    </div>
  );
}
