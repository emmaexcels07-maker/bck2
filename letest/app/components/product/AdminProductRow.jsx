"use client";

import { useState } from "react";
import { getToken } from "../../lib/auth";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminProductRow({ product, onProductDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    // In a production app, consider using a library like 'sonner' or 'react-hot-toast'
    // instead of window.confirm for a more polished feel.
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    setIsDeleting(true);
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        onProductDeleted();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <tr className="hover:bg-gray-700/30 transition-colors border-b border-gray-700">
      <td className="p-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-600 bg-gray-900">
          <img
            src={product.image?.url || product.image || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "/placeholder.png"; }}
          />
        </div>
      </td>
      <td className="p-4 font-medium text-gray-200">{product.name}</td>
      <td className="p-4 text-right text-gray-300">${Number(product.price).toFixed(2)}</td>
      <td className="p-4 text-right">
        <span className={`px-2 py-1 rounded text-xs font-mono ${product.stock > 5 ? "text-green-400" : "text-red-400"}`}>
          {product.stock}
        </span>
      </td>
      <td className="p-4 text-right space-x-4">
        <Link
          href={`/admin/products/${product._id}/edit`}
          className="text-blue-400 hover:text-blue-300 hover:underline text-sm font-medium"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`text-sm font-medium transition-colors ${isDeleting ? "text-gray-500 cursor-not-allowed" : "text-red-400 hover:text-red-300"
            }`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </td>
    </tr>
  );
}