"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/orders/${params.id}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          }
        });
        const data = await res.json();
        if (data.success) setOrder(data.order);
      } catch (err) {
        console.error("Failed to load order", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id, API]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading order details...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;

  const getStatusStyle = (status) => {
    if (status === 'delivered') return 'bg-green-100 text-green-700';
    if (status === 'shipped') return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <Link href="/orders" className="text-indigo-600 font-semibold mb-6 inline-block hover:underline">
          ← Back to Orders
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Order #{order._id.slice(-6)}</h1>
              <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${getStatusStyle(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((i, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-900">{i.quantity}x</span> {i.product.title}
                  </p>
                  <p className="font-bold text-gray-900">${Number(i.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Total */}
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping To</h2>
              <p className="font-semibold text-gray-900">{order.shipping.name}</p>
              <p className="text-gray-600">{order.shipping.address}</p>
              <p className="text-gray-600">{order.shipping.city}, {order.shipping.country}</p>
            </div>
            
            <div className="text-left md:text-right">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Total Amount</h2>
              <p className="text-4xl font-extrabold text-indigo-600">${Number(order.total).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}