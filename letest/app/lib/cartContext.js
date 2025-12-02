"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, { credentials: "include", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function addToCart(productId, quantity = 1) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify({ productId, quantity })
    });
    const data = await res.json();
    if (data.success) setCart(data.cart);
  }

  async function removeFromCart(productId) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (data.success) setCart(data.cart);
  }

  async function clearCart() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
    setCart([]);
  }

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, loading }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
