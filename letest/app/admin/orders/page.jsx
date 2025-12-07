"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch(`${API}/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    if (data.success) setOrders(data.orders);
  }

  async function updateStatus(id, status) {
    await fetch(`${API}/orders/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-gray-800 p-4 rounded">
            <p className="font-bold">
              Order #{o._id} — {o.user?.email}
            </p>

            <p>Total: ${o.total}</p>
            <p>Status: {o.status}</p>

            <select
              className="text-black p-2 mt-2"
              value={o.status}
              onChange={(e) => updateStatus(o._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
