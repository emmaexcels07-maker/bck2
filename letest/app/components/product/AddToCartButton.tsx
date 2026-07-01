"use client";

import { useState } from "react";
import { useCartStore } from "../store/cart.store";
import { Product } from "../types/product";

interface Props {
  product: Product;
  quantity: number;
  className?: string; // Allow overriding styles if needed
}

export default function AddToCartButton({ product, quantity, className = "" }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (outOfStock) return;

    setIsAdding(true);
    addItem(product, quantity);

    // Reset the visual feedback after 1 second
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <button
      disabled={outOfStock || isAdding}
      onClick={handleAddToCart}
      className={`
        relative px-8 py-3 rounded-xl font-bold text-white transition-all duration-200
        ${outOfStock
          ? "bg-gray-300 cursor-not-allowed opacity-50"
          : isAdding
            ? "bg-green-600 shadow-green-200"
            : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-200"
        }
        ${className}
      `}
    >
      <span className="flex items-center justify-center gap-2">
        {outOfStock
          ? "Out of Stock"
          : isAdding
            ? "Added!"
            : "Add to Cart"
        }
      </span>
    </button>
  );
}