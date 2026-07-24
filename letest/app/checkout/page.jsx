"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getToken } from "../lib/auth"; // Aligned with auth helper
import { Loader2, ShoppingBag, ShieldCheck, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Hydrate cart from localStorage safely
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart);
    } catch (err) {
      console.error("Error reading cart:", err);
    } finally {
      setIsMounted(true);
    }
  }, []);

  // Compute order total
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);
  }, [cart]);

  const handleChange = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage("");
  };

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setErrorMessage("");

    // Basic Validation
    const emptyFields = Object.entries(shipping).filter(
      ([_, value]) => !value.trim()
    );

    if (emptyFields.length > 0) {
      setErrorMessage("Please fill out all shipping details.");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Session expired. Please sign in again.");
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      // Map payload to fit clean API interface
      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity || 1,
          price: item.price,
        })),
        shippingAddress: shipping,
        totalAmount: subtotal,
      };

      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && (data.success || data._id || data.order)) {
        const orderId = data.order?._id || data._id;
        localStorage.removeItem("cart"); // Clear cart on success
        router.push(`/order/${orderId}`);
      } else {
        setErrorMessage(data.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h1>
        <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
        <button
          onClick={() => router.push("/shop")}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Shipping Form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h1>

            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={shipping.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Street Address
                </label>
                <input
                  required
                  type="text"
                  name="address"
                  placeholder="123 Main St, Apt 4B"
                  value={shipping.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="New York"
                    value={shipping.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Postal Code
                  </label>
                  <input
                    required
                    type="text"
                    name="postalCode"
                    placeholder="10001"
                    value={shipping.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  required
                  type="text"
                  name="country"
                  placeholder="United States"
                  value={shipping.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>Complete Order (${subtotal.toFixed(2)})</span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto mb-4 pr-1">
                {cart.map((item) => (
                  <div key={item._id} className="py-3 flex justify-between items-center text-sm">
                    <div className="pr-2">
                      <p className="font-medium text-gray-900 truncate max-w-[160px]">
                        {item.name || item.title}
                      </p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-indigo-900 text-xs">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              <p>Your details are protected with secure SSL encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}