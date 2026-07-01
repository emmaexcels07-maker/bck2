"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  async function placeOrder() {
    setLoading(true);
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ items: cart, shipping }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("cart");
        router.push(`/order/${data.order._id}`);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-6"
    >
      <div className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        <div className="space-y-5">
          {Object.keys(shipping).map((key) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 capitalize mb-2">
                {key}
              </label>
              <input
                name={key}
                placeholder={`Enter your ${key}`}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={handleChange}
                value={shipping[key]}
              />
            </div>
          ))}

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}