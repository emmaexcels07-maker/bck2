"use client";

import React from "react";
import { Product } from "../types/product";
import { useCartStore } from "../../lib/store";

interface Props {
  product: Product;
  quantity?: number;
  disabled?: boolean; // 👈 Added optional disabled prop
  className?: string;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  disabled = false,
  className = "",
}: Props) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button
      disabled={disabled}
      onClick={() => addToCart(product, quantity)}
      className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled
          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
          : "bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-sm hover:shadow-indigo-500/20 focus:ring-indigo-500"
      } ${className}`}
    >
      {disabled ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}