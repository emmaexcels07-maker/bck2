"use client";
import { useState, useEffect } from "react";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        console.error("Failed to load products:", data.message);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStock(id, newStock) {
    if (newStock < 0) return;

    try {
      const res = await fetch(`${API}/products/${id}/stock`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        loadProducts(); // Reload to get updated data
      } else {
        alert("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("An error occurred while updating stock");
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading inventory...</div>;
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
          {products.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-3 text-center">No products found.</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.name}</td>

                <td className={`${p.stock < 5 ? "text-red-600 font-bold" : ""}`}>
                  {p.stock}
                  {p.stock < 5 && " (LOW)"}
                </td>

                <td className="space-x-2 p-3">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateStock(p._id, p.stock + 1)}
                  >
                    +
                  </button>

                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
                    min="0"
                    onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
