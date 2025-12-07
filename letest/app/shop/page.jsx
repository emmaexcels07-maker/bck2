"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken, removeToken } from "../lib/auth.js";

const API_URL = "https://bck2-dtr1.onrender.com/api";

async function apiRequest(url, method = "GET", body = null) {
  const token = getToken();

  const res = await fetch(url, {
    next: { revalidate: 10 },
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
}

export default function EcommercePage() {
  const router = useRouter();
  const params = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [cart, setCart] = useState([]);

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const min = params.get("min") || "";
  const max = params.get("max") || "";
  const page = params.get("page") || 1;

  // 🔒 AUTH CHECK + INITIAL PRODUCTS LOAD
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }

    async function loadProducts() {
      const data = await apiRequest(`${API_URL}/products`);
      if (data.success) setProducts(data.products);
      setLoading(false);
    }
    loadProducts();
  }, []);

  // 🔍 FILTER + CATEGORY FETCH
  useEffect(() => {
    async function loadShop() {
      setLoading(true);

      const q = new URLSearchParams({
        search,
        category,
        min,
        max,
        page,
      }).toString();

      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/products/shop?` + q),
        fetch(`${API_URL}/categories`)
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) {
        setProducts(prodData.products);
        setPages(prodData.pages);
      }

      if (catData.success) {
        setCategories(catData.categories);
      }

      setLoading(false);
    }

    loadShop();
  }, [search, category, min, max, page]);

  function updateFilter(key, value) {
    const newParams = new URLSearchParams(params.toString());
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    router.push(`/shop?${newParams.toString()}`);
  }

  function addToCart(item) {
    setCart([...cart, item]);
  }

  function handleLogout() {
    removeToken();
    router.replace("/signin");
  }

  if (loading)
    return <div className="p-6 text-center text-lg">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">E-Commerce Store</h1>
        <div className="flex gap-4 items-center">
          <span className="font-semibold text-white">Cart: {cart.length}</span>
          <button onClick={handleLogout} className="text-red-400">Logout</button>
        </div>
      </div>

      {/* FILTER BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          placeholder="Search products..."
          className="p-3 rounded-lg border"
          value={search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />

        <select
          className="p-3 rounded-lg border"
          value={category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input
          placeholder="Min price"
          type="number"
          className="p-3 rounded-lg border"
          value={min}
          onChange={(e) => updateFilter("min", e.target.value)}
        />

        <input
          placeholder="Max price"
          type="number"
          className="p-3 rounded-lg border"
          value={max}
          onChange={(e) => updateFilter("max", e.target.value)}
        />
      </motion.div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer"
          >
            <img
              src={product.image || "https://via.placeholder.com/300"}
              className="w-full h-48 rounded-lg object-cover"
            />
            <h3 className="text-lg font-semibold mt-3">{product.title}</h3>
            <p className="text-blue-600 font-bold text-xl">${product.price}</p>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-blue-800 text-white py-2 mt-4 rounded-lg"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-10 gap-3">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => updateFilter("page", i + 1)}
            className={`px-4 py-2 rounded-lg ${
              Number(page) === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white shadow"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}
