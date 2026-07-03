"use client";

import { useEffect, useState, useCallback } from "react";
import { Product } from "../../components/types/product";
import { getToken } from "../../lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/products`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;

    const originalProducts = [...products];
    setProducts((prev) => prev.filter((p) => p._id !== id));

    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      setProducts(originalProducts);
      alert("Failed to delete product. It may still be in use.");
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Product Inventory</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors font-medium text-sm">
          + Add Product
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">{error}</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-950/50 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold text-gray-400 text-sm">Product</th>
                <th className="p-4 font-semibold text-gray-400 text-sm">Price</th>
                <th className="p-4 font-semibold text-gray-400 text-sm">Stock</th>
                <th className="p-4 font-semibold text-gray-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-gray-200 font-medium">{p.name}</td>
                    <td className="p-4 text-gray-400">${Number(p.price).toFixed(2)}</td>
                    <td className="p-4 text-gray-400">{p.stock} units</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(p._id)} 
                        className="text-red-400 hover:text-red-300 transition-colors font-medium text-sm"
                      >
                        Delete
                      </button>
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