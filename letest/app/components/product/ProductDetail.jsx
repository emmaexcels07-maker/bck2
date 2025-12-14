"use client";
import { useState } from "react";
import { Product } from "../types/product.ts";
import AddToCartButton from "./AddToCartButton";
import QuantitySelector from "./QuantitySelector";
import { useCartStore } from "../store/cart.store.ts";

interface Props { product: Product }

export default function ProductDetail({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-xl shadow">
      <div className="flex-1">
        <img src={product.images[0]} alt={product.name} className="rounded" />
      </div>

      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-gray-700">${product.price}</p>
        {product.stock <= 0 ? (
          <span className="text-red-500 font-semibold">Out of stock</span>
        ) : (
          <>
            <QuantitySelector max={product.stock} onChange={setQuantity} />
            <button
              onClick={handleAddToCart}
              className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              Add {quantity} to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
