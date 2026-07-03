"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken } from "../../lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function InventoryTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.products);
      else throw new Error("Failed to load inventory");
    } catch (err) {
      setError("Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function updateStock(id: string, newStock: number) {
    if (newStock < 0) return;

    const previousProducts = [...products];
    setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, stock: newStock } : p)));

    try {
      const res = await fetch(`${API}/products/${id}/stock`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (!res.ok) throw new Error();
    } catch (err) {
      setProducts(previousProducts);
      alert("Failed to update stock. Changes reverted.");
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inventory...</div>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-white">Inventory Management</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {error ? (
          <div className="p-12 text-center text-red-400">{error}</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-950/50 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold text-gray-400 text-sm">Product</th>
                <th className="p-4 font-semibold text-gray-400 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-400 text-sm">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 text-gray-200 font-medium">{p.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.stock < 5 ? "bg-red-900/30 text-red-300" : "bg-green-900/30 text-green-300"
                    }`}>
                      {p.stock < 5 ? `Low Stock (${p.stock})` : `${p.stock} units`}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <button 
                      onClick={() => updateStock(p._id, Math.max(0, p.stock - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >-</button>
                    
                    <input
                      type="number"
                      value={p.stock}
                      className="w-16 text-center bg-gray-950 border border-gray-700 rounded p-1 text-gray-200 outline-none focus:ring-1 focus:ring-indigo-500"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) updateStock(p._id, val);
                      }}
                    />
                    
                    <button 
                      onClick={() => updateStock(p._id, p.stock + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}