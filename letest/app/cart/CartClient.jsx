"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartClient() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Safe Client-Side Initialization (Prevents Hydration Mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage:", err);
    } finally {
      setIsMounted(true);
    }
  }, []);

  // 2. Sync changes back to localStorage only after mounted
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  // Cart Mutators
  const updateQuantity = useCallback((id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }, []);

  // Computed Subtotal & Item Counts
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);
  }, [cart]);

  // Render Skeleton/Loader while waiting for client hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center items-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Empty State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't added any items to your shopping cart yet.
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Shopping Cart
          </h1>
          <span className="text-sm font-medium text-gray-500">
            {cart.length} {cart.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Cart Item List */}
        <div className="space-y-4">
          <AnimatePresence>
            {cart.map((item) => {
              const itemTitle = item.name || item.title || "Product";
              const itemPrice = Number(item.price) || 0;
              const quantity = item.quantity || 1;

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={item.image || item.imageUrl || "/placeholder.jpg"}
                      alt={itemTitle}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  {/* Title & Unit Price */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {itemTitle}
                    </h2>
                    <p className="text-indigo-600 font-semibold text-sm sm:text-base mt-0.5">
                      ${itemPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Stepper & Removal Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="text-sm font-bold text-gray-900">
                        ${(itemPrice * quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Checkout Summary Card */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Order Subtotal
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-0.5">
              ${subtotal.toFixed(2)}
            </h2>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 text-center"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}