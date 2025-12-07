"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard.jsx";
import ProductSkeleton from "../../components/ProductSkeleton.jsx";
import { getToken, removeToken } from "../lib/auth.js";

const API_URL = "https://bck2-dtr1.onrender.com/api";

export default function ShopClient() {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const min = params.get("min") || "";
  const max = params.get("max") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const loaderRef = useRef(null);
  const abortRef = useRef(null);

  // AUTH CHECK
  useEffect(() => {
    if (!getToken()) router.replace("/signin");
  }, []);

  // LOAD CATEGORIES (once)
  useEffect(() => {
    fetch(`${API_URL}/categories`).then(res =>
      res.json().then(d => d.success && setCategories(d.categories))
    );
  }, []);

  // MAIN FETCH (optimized + cancellable)
  const fetchProducts = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);

    const query = new URLSearchParams({
      search, category, min, max, page
    }).toString();

    try {
      const res = await fetch(`${API_URL}/products/shop?${query}`, {
        signal: abortRef.current.signal,
      });
      const data = await res.json();

      if (data.success) {
        setProducts(prev => [...prev, ...data.products]);
        setHasMore(data.products.length > 0);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }

    setLoading(false);
  }, [search, category, min, max, page]);

  // RESET + REFETCH when filters change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search, category, min, max]);

  // FETCH products when page changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // INFINITE SCROLL
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading]);

  function updateFilter(key, value) {
    const q = new URLSearchParams(params.toString());
    if (value) q.set(key, value);
    else q.delete(key);
    router.push(`/shop?${q.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Shop</h1>
        <button
          className="text-red-400"
          onClick={() => {
            removeToken();
            router.replace("/signin");
          }}
        >
          Logout
        </button>
      </div>

      {/* FILTER BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-xl shadow grid md:grid-cols-4 gap-4"
      >
        <input
          placeholder="Search…"
          className="p-3 rounded border"
          value={search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />

        <select
          className="p-3 rounded border"
          value={category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input
          placeholder="Min price"
          type="number"
          className="p-3 rounded border"
          value={min}
          onChange={(e) => updateFilter("min", e.target.value)}
        />
        <input
          placeholder="Max price"
          type="number"
          className="p-3 rounded border"
          value={max}
          onChange={(e) => updateFilter("max", e.target.value)}
        />
      </motion.div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
        {products.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} />
        ))}

        {loading &&
          [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>

      {/* INFINITE SCROLL LOADER */}
      <div ref={loaderRef} className="text-center py-10 text-gray-400">
        {hasMore ? "Loading more…" : "No more products"}
      </div>
    </div>
  );
}
