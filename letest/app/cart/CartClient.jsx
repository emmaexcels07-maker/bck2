"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CartClient() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function removeItem(id) {
    setCart((prev) => prev.filter((x) => x._id !== id));
  }

  function total() {
    return cart.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2);
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => router.push("/shop")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">Your Cart</h1>

        <div className="space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 items-center"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
                  <p className="text-indigo-600 font-bold text-lg mt-1">${Number(item.price).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeItem(item._id)}
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Footer */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Amount</p>
            <h2 className="text-3xl font-extrabold text-gray-900">${total()}</h2>
          </div>

          <button
            className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            onClick={() => alert("Checkout coming soon")}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}