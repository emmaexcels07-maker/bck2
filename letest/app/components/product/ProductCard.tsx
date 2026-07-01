"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { Product } from "../types/product";

export default function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Product Image */}
      <Link href={`/product/${product._id}`} className="block aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
        />
      </Link>

      {/* Content */}
      <div className="p-5 space-y-3">
        <Link href={`/product/${product._id}`} className="block">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
        </Link>

        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>

          {isOutOfStock ? (
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">
              Sold Out
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-lg">
              In Stock
            </span>
          )}
        </div>

        {/* Button - Full width for better interaction */}
        <div className="pt-2">
          <AddToCartButton product={product} quantity={1} />
        </div>
      </div>
    </article>
  );
}
