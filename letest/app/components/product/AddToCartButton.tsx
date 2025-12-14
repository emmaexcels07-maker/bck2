"use client";
import { useCartStore } from "../store/cart.store";
import { Product } from "../types/product";

interface Props { product: Product }

export default function AddToCartButton({ product }: Props) {
  const addItem = useCartStore(state => state.addItem);
  const outOfStock = product.stock <= 0;

  return (
    <button
      disabled={outOfStock}
      onClick={() => addItem(product)}
      className={`w-full py-2 rounded font-medium transition
        ${outOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
    >
      {outOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
