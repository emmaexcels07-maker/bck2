"use client";

import { useState } from "react";
import { Product } from "../types/product";
import AddToCartButton from "./AddToCartButton";
import QuantitySelector from "./QuantitySelector";

interface Props { product: Product }

export default function ProductDetail({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-6xl mx-auto p-6 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left: Image Gallery (Premium Layout) */}
        <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <img 
            src={product.images?.[0] || "/placeholder.png"} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
          />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
            <p className="text-2xl font-bold text-indigo-600 mt-2">${Number(product.price).toFixed(2)}</p>
          </div>

          <div className="prose text-gray-600">
            <p>{product.description || "No description available for this product."}</p>
          </div>

          {/* Action Section */}
          <div className="pt-6 border-t border-gray-100 space-y-6">
            {isOutOfStock ? (
              <div className="px-6 py-4 bg-gray-50 rounded-xl text-center font-bold text-gray-500 uppercase tracking-widest">
                Out of Stock
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-500">Quantity</span>
                  <QuantitySelector max={product.stock} onChange={setQuantity} />
                </div>
                
                {/* Pass quantity to your button. 
                   Ensure your AddToCartButton component is updated to accept this prop.
                */}
                <AddToCartButton 
                  product={product} 
                  quantity={quantity} 
                  className="w-full py-4 text-lg" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}