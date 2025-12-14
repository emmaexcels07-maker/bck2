import { create } from "zustand";
import { Product } from "../types/product";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  
addItem: (product: Product, quantity: number = 1) => 
  set((state) => ({
    items: [...state.items, { product, quantity }],
  })),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter(item => item.product._id !== productId)
    })),
}));
