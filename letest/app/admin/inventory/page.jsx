"use client";

import { useEffect, useState } from "react";
import { getToken } from "../../lib/auth"; // Ensure this import path is correct

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch(`${API}/products`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }

  // Optimistic UI Update
  async function updateStock(id, newStock) {
    if (newStock < 0) return;

    const previousProducts = [...products];
    
    // 1. Update UI Immediately
    setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));

    try {
      const res = await fetch(`${API}/products/${id}/stock`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stock: newStock })
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (error) {
      // Rollback on failure
      setProducts(previousProducts);
      alert("Failed to update stock. Changes reverted.");
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inventory...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Product</th>
              <th className="p-4 font-semibold text-gray-700">Stock Status</th>
              <th className="p-4 font-semibold text-gray-700">Adjust Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{p.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.stock < 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {p.stock < 5 ? `Low Stock (${p.stock})` : `${p.stock} units`}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-2">
                  <button 
                    onClick={() => updateStock(p._id, p.stock - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >-</button>
                  
                  <input
                    type="number"
                    value={p.stock}
                    className="w-16 text-center border border-gray-300 rounded-lg p-1"
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) updateStock(p._id, val);
                    }}
                  />
                  
                  <button 
                    onClick={() => updateStock(p._id, p.stock + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >+</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}