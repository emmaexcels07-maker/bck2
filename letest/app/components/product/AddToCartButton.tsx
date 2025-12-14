"use client";

import { useCartStore } from "../store/cart.store";
import { Product } from "../types/product";

interface Props { product: Product }

export default function AddToCartButton({ product }: Props) {
  const addItem = useCartStore(state => state.addItem); // now state is typed
  const outOfStock = product.stock <= 0;

  return (
    <button 
      disabled={outOfStock}
      onClick={() => addItem(product)}
    >
      Add to Cart
    </button>
  );
}
