"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { Product } from "../types/product";

export default function ProductCard({ product }: { product: Product }) {
  const [imgSrc, setImgSrc] = useState<string>(
    product.images?.[0] || "/placeholder.png"
  );

  // Safe fallback checks for stock & price
  const stockCount = typeof product.stock === "number" ? product.stock : 0;
  const isOutOfStock = stockCount <= 0;
  const formattedPrice =
    typeof product.price === "number" ? product.price.toFixed(2) : "0.00";

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Product Image */}
      <Link
        href={`/product/${product._id}`}
        className="relative block aspect-square w-full overflow-hidden bg-slate-100"
      >
        <Image
          src={imgSrc}
          alt={product.name || "Product image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc("/placeholder.png")}
        />

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white rounded-full shadow-sm">
              Out of Stock
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md text-white rounded-full shadow-sm">
              In Stock
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex-1 space-y-1">
          <Link href={`/product/${product._id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="font-bold text-slate-900 line-clamp-1 text-base tracking-tight">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price Tag */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            ${formattedPrice}
          </span>
        </div>

        {/* Full-width Action Button */}
        <div className="pt-2">
          <AddToCartButton product={product} quantity={1} disabled={isOutOfStock} />
        </div>
      </div>
    </article>
  );
}