"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../lib/cartContext";
import { motion } from "framer-motion";
import { useCartStore } from "../../lib/store";
import Image from "next/image";
import Link from "next/link";

export default function ProductPage({ params }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://bck2-dtr1.onrender.com/api/products/${params.id}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gray-50 py-12 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <Link href="/shop" className="text-indigo-600 font-semibold mb-8 inline-block hover:underline">
          ← Back to Shop
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <motion.div 
            initial={{ scale: 0.95 }} 
            animate={{ scale: 1 }}
            className="overflow-hidden rounded-2xl bg-gray-100 aspect-square relative"
          >
            <Image
              src={product.image || "/placeholder.jpg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{product.title}</h1>
            <p className="text-3xl text-indigo-600 font-bold mt-4">${Number(product.price).toFixed(2)}</p>
            
            <div className="prose prose-indigo mt-8 text-gray-600">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p>{product.description}</p>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="mt-10 w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}