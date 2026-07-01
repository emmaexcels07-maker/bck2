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
  const urlSearchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement>(null);

  const filters = {
    search:
      typeof searchParams.search === "string" ? searchParams.search : "",
    category:
      typeof searchParams.category === "string" ? searchParams.category : "",
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

  useEffect(() => {
    if (!hasNextPage || !loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const updateFilter = (key: string, value: string) => {
    const q = new URLSearchParams(urlSearchParams.toString());

    if (value) {
      q.set(key, value);
    } else {
      q.delete(key);
    }

    router.push(`/shop?${q.toString()}`);
  };

  const products = data?.pages.flat() ?? [];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search products..."
          defaultValue={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        />

        <input
          type="number"
          placeholder="Min price"
          defaultValue={filters.min}
          onChange={(e) => updateFilter("min", e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        />

        <input
          type="number"
          placeholder="Max price"
          defaultValue={filters.max}
          onChange={(e) => updateFilter("max", e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <ProductGrid
        products={products}
        loading={isLoading || isFetchingNextPage}
      />

      {!isLoading && products.length === 0 && (
        <p className="text-center text-gray-400 mt-20">
          No products found.
        </p>
      )}

      <div
        ref={loaderRef}
        className="text-center py-10 text-gray-400"
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Scroll for more"
          : "No more products"}
      </div>
    </div>
  );
}