"use client";

import { useEffect, useState, use } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getToken } from "../../lib/auth"; // Unified auth helper
import { ArrowLeft, Loader2, PackageCheck, AlertCircle } from "lucide-react";

export default function OrderDetailPage({ params: paramsPromise }) {
  // Unwrap params safely for Next.js 15 compatibility
  const routeParams = useParams();
  const orderId = routeParams?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || "https://bck2-dtr1.onrender.com/api";

  useEffect(() => {
    async function loadOrder() {
      const token = getToken();
      if (!token) {
        setError("You must be logged in to view order details.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok && (data.success || data.order || data._id)) {
          setOrder(data.order || data);
        } else {
          setError(data.message || "Failed to retrieve order details.");
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        setError("A network error occurred while loading the order.");
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId, API]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm font-medium">Fetching order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">{error || "We couldn't locate this order."}</p>
        <Link
          href="/orders"
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all"
        >
          Back to All Orders
        </Link>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "delivered") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === "shipped") return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "cancelled") return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  // Safe fallback extractors for schema discrepancies
  const shipping = order.shippingAddress || order.shipping || {};
  const totalAmount = Number(order.totalAmount ?? order.total ?? 0);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3">
                <PackageCheck className="w-7 h-7 text-indigo-600" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Order #{order._id?.slice(-6) || "N/A"}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Placed on{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status || "Pending"}
            </span>
          </div>

          {/* Items List */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Items Ordered
            </h2>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
              {items.map((i, index) => {
                // Handle both populated product object and plain product ID string
                const productTitle =
                  typeof i.product === "object" && i.product !== null
                    ? i.product.name || i.product.title
                    : i.title || i.name || "Product Item";

                const unitPrice = Number(i.price || i.product?.price || 0);
                const qty = Number(i.quantity || 1);

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{productTitle}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {qty} × ${unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ${(unitPrice * qty).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping & Order Total */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Shipping Address
              </h2>
              <p className="text-sm font-semibold text-gray-900">{shipping.name || "N/A"}</p>
              <p className="text-sm text-gray-600 mt-0.5">{shipping.address || ""}</p>
              <p className="text-sm text-gray-600">
                {[shipping.city, shipping.postalCode, shipping.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="sm:text-right">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Total Amount Paid
              </h2>
              <p className="text-3xl font-extrabold text-indigo-600">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
