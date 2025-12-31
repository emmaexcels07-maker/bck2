"use client";

import { getToken } from "../../lib/auth.js";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminProductRow({ product, onDelete }) {
  async function deleteProduct() {
    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        onDelete();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product");
    }
  }

  return (
    <tr className="border-b">
      <td className="p-3">
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded"
        />
      </td>

      <td className="p-3">{product.name}</td>
      <td className="p-3">${product.price}</td>

      <td className="p-3">
        <button
          onClick={deleteProduct}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
