"use client";

import { getToken } from "@/app/lib/auth";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminProductRow({ product, onDelete }) {
  async function handleDelete() {
    if (!confirm("Delete this product permanently?")) return;

    const token = getToken();
    if (!token) {
      alert("Not authenticated");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/products/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete product");
        return;
      }

      alert("Product deleted successfully");
      onDelete();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error occurred");
    }
  }

  return (
    <tr className="border-t hover:bg-gray-50 transition">
      <td className="p-3">
        <img
          src={product.image?.url || product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />
      </td>
      <td className="p-3 font-medium">{product.name}</td>
      <td className="p-3 text-right">${product.price?.toFixed(2)}</td>
      <td className="p-3 text-right text-sm text-gray-600">{product.stock} units</td>
      <td className="p-3 space-x-2 flex gap-2">
        <Link
          href={`/admin/products/${product._id}/edit`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
