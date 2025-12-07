"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API}/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (data.success) setOrder(data.order);
    }
    load();
  }, [params.id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Order #{order._id}</h1>

      <h2 className="text-xl mb-2">Items:</h2>
      {order.items.map((i, index) => (
        <p key={index}>
          {i.quantity} × {i.product.title} — ${i.price}
        </p>
      ))}

      <h2 className="mt-4 text-xl">Shipping:</h2>
      <p>{order.shipping.name}</p>
      <p>{order.shipping.address}</p>

      <h2 className="mt-4 text-xl">Total:</h2>
      <p>${order.total}</p>

      <h2 className="mt-4 text-xl">Status:</h2>
      <p className="capitalize">{order.status}</p>
    </div>
  );
}
