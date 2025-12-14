import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set({ items: [...get().items, product] }),
      removeItem: (id) =>
        set({ items: get().items.filter(i => i._id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);
