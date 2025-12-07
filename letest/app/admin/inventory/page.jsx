"use client";
import { useState, useEffect } from "react";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const API = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    if (data.success) setProducts(data.products);
  }

  async function updateStock(id, newStock) {
    await fetch(`${API}/products/${id}/stock`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ stock: newStock })
    });
    load();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Inventory Management</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Product</th>
            <th>Stock</th>
            <th>Adjust</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-3">{p.title}</td>

              <td className={`${p.stock < 5 ? "text-red-600" : ""}`}>
                {p.stock}
                {p.stock < 5 && " (LOW)"}
              </td>

              <td className="space-x-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => updateStock(p._id, p.stock + 1)}
                >
                  +
                </button>

                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() =>
                    updateStock(p._id, p.stock > 0 ? p.stock - 1 : 0)
                  }
                >
                  -
                </button>

                <input
                  type="number"
                  className="border p-1 w-20"
                  defaultValue={p.stock}
                  onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
