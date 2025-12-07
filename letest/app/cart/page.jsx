"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import CartClient from "./CartClient.jsx";


export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  function updateQty(index, qty) {
    const copy = [...cart];
    copy[index].quantity = qty;
    setCart(copy);
    localStorage.setItem("cart", JSON.stringify(copy));
  }

  return (
    <Suspense fallback={<div className="text-white p-10">Loading cart…</div>}>
      <CartClient />
    
    
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      <div className="space-y-4">
        {cart.map((item, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded flex justify-between">
            <div>
              <p className="font-bold">{item.title}</p>
              <p>${item.price}</p>
            </div>

            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQty(i, Number(e.target.value))}
              className="w-20 text-black p-1"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/checkout")}
        className="bg-green-600 px-4 py-2 mt-6 rounded"
      >
        Proceed to Checkout
      </button>
    </div>
    </Suspense>
    );
}
