"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Plus, Minus, Loader2, ShoppingBag } from "lucide-react";

export default function ProductPage({ params: paramsPromise }) {
  // 1. Unwrap async params for Next.js 15 compatibility
  const params = use(paramsPromise);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "https://bck2-dtr1.onrender.com/api";

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API}/products/${params.id}`);
        if (!res.ok) throw new Error("Failed to load product details");
        const data = await res.json();
        
        // Normalize response payload structure
        setProduct(data.product || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      fetchProduct();
    }
  }, [params?.id, API]);

  // Unified LocalStorage Cart Sync (Matching CartClient implementation)
  const handleAddToCart = () => {
    if (!product) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = existingCart.findIndex((x) => x._id === product._id);

      if (existingIndex > -1) {
        existingCart[existingIndex].quantity =
          (existingCart[existingIndex].quantity || 1) + quantity;
      } else {
        existingCart.push({ ...product, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));

      // Trigger temporary visual success feedback
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Failed to update cart in localStorage:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">{error || "Unable to retrieve details."}</p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const title = product.name || product.title || "Product Details";
  const price = Number(product.price) || 0;
  const imageSrc = product.image || product.imageUrl || "/placeholder.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="overflow-hidden rounded-2xl bg-gray-100 aspect-square relative"
          >
            <Image
              src={imageSrc}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          {/* Product Details & Actions */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {title}
              </h1>
              <p className="text-2xl sm:text-3xl text-indigo-600 font-extrabold mt-3">
                ${price.toFixed(2)}
              </p>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Description
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description || "No product description provided."}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  added
                    ? "bg-emerald-600 text-white shadow-emerald-100"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart — ${(price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}