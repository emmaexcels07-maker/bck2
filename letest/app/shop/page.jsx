"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, saveToken } from "../lib/auth.js";

// 🔗 YOUR BACKEND PRODUCTS API
const API_URL = "https://bck2-dtr1.onrender.com/api"; // update if needed

async function apiRequest(url, method = "GET", body = null) {
  const token = getToken();

  const res = await fetch(`${API_URL}/products`, {
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

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

  function addToCart(item) {
    setCart([...cart, item]);
  }

  function handleLogout() {
    removeToken();
    router.replace("/signin");
  }

  if (loading) return <div className="p-6 text-center text-lg">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">E-Commerce Store</h1>
        <div className="flex gap-4 items-center">
          <span className="font-semibold">Cart: {cart.length}</span>
          <button onClick={handleLogout} className="text-red-600">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition">
            <img
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-lg font-bold mb-4">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-blue-800 text-white py-2 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}