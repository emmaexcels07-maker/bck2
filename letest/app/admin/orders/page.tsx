"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken } from "../../lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else throw new Error("Failed to fetch");
    } catch (err) {
      console.error(err);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function updateStatus(id: string, newStatus: string) {
    const previousOrders = [...orders];
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o)));

    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();
    } catch (err) {
      setOrders(previousOrders);
      alert("Failed to update status. Reverting changes.");
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-white">Order Management</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">{error}</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-950/50 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold text-gray-400 text-sm">Order ID</th>
                <th className="p-4 font-semibold text-gray-400 text-sm">Customer</th>
                <th className="p-4 font-semibold text-gray-400 text-sm">Total</th>
                <th className="p-4 font-semibold text-gray-400 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-400 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">No orders placed yet.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-400">#{o._id.slice(-6)}</td>
                    <td className="p-4 text-gray-200">{o.user?.email || "Guest"}</td>
                    <td className="p-4 text-gray-300">${o.total?.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        o.status === 'delivered' ? 'bg-green-900/30 text-green-300' :
                        o.status === 'shipped' ? 'bg-blue-900/30 text-blue-300' :
                        o.status === 'cancelled' ? 'bg-red-900/30 text-red-300' :
                        'bg-yellow-900/30 text-yellow-300'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        className="bg-gray-950 border border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}