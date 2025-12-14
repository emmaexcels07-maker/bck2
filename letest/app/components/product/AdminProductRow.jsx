"use client";

import { getToken } from "../../lib/auth.js";

const API_URL = "https://bck2-dtr1.onrender.com/api";

export default function AdminProductRow({ product, onDelete }) {
  async function deleteProduct() {
    const token = getToken();

    const res = await fetch(`${API_URL}/products/${product._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) onDelete();
  }

  return (
    <tr className="border-b">
      <td className="p-3">
        <img
          src={product.image}
          className="w-20 h-20 object-cover rounded"
        />
      </td>

      <td className="p-3">{product.title}</td>
      <td className="p-3">${product.price}</td>

      <td className="p-3">
        <button
          onClick={deleteProduct}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
