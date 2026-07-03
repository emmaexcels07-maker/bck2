// lib/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (product) => 
        set((state) => ({ cartItems: [...state.cartItems, product] })),
      removeFromCart: (productId) => 
        set((state) => ({ 
          cartItems: state.cartItems.filter((item) => item._id !== productId) 
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'cart-storage', // Key for localStorage
    }
  )
);