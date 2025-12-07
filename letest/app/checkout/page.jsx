"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ items: cart, shipping }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.removeItem("cart");
      router.push(`/order/${data.order._id}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {Object.keys(shipping).map((key) => (
        <input
          key={key}
          placeholder={key}
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
        />
      ))}

      <button
        onClick={placeOrder}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
}
