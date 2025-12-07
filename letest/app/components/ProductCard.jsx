"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, index }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => router.push(`/product/${product._id}`)}
      className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-xl transition"
    >
      <img
        src={product.image || "https://via.placeholder.com/300"}
        loading="lazy"
        className="w-full h-48 object-cover rounded"
        alt={product.title}
      />

      <h3 className="text-lg font-semibold mt-3">{product.title}</h3>

      <p className="text-blue-600 font-bold text-xl">${product.price}</p>
    </motion.div>
  );
}
