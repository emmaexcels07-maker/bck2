"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartClient() {
  const router = useRouter();

  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function removeItem(id) {
    setCart((prev) => prev.filter((x) => x._id !== id));
  }

  function total() {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  }

  if (!cart.length)
    return (
      <div className="p-10 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>

        <button
          onClick={() => router.push("/shop")}
          className="bg-blue-600 px-6 py-2 rounded text-white"
        >
          Go Shopping
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-10">Your Cart</h1>

      <div className="grid gap-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex gap-6 bg-white text-black p-6 rounded-xl shadow"
          >
            <img
              src={item.image}
              className="w-32 h-32 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="text-blue-600 font-bold text-lg">${item.price}</p>
            </div>

            <button
              onClick={() => removeItem(item._id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="text-right mt-10">
        <h2 className="text-2xl font-bold">Total: ${total()}</h2>

        <button
          className="mt-4 bg-green-600 px-8 py-3 rounded text-white text-lg"
          onClick={() => alert("Checkout coming soon")}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
