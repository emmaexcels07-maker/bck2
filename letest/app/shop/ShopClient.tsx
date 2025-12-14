"use client";

import { useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteProducts } from "../hook/useInfiniteProducts";
import ProductGrid from "../components/product/ProductGrid";

export default function ShopClient({ searchParams }) {
  const router = useRouter();
  const loaderRef = useRef<HTMLDivElement>(null);

  const filters = {
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    min: searchParams.get("min") ?? "",
    max: searchParams.get("max") ?? "",
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteProducts(filters);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || !loaderRef.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) fetchNextPage(); }, { rootMargin: "200px" });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const updateFilter = (key: string, value: string) => {
    const q = new URLSearchParams(searchParams.toString());
    value ? q.set(key, value) : q.delete(key);
    router.push(`/shop?${q.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Filter bar */}
      {/* ... input/select elements calling updateFilter */}
      
      <ProductGrid
        products={data?.pages.flat() ?? []}
        loading={isLoading || isFetchingNextPage}
      />

      <div ref={loaderRef} className="text-center py-10 text-gray-400">
        {hasNextPage ? "Loading more…" : "No more products"}
      </div>
    </div>
  );
}
