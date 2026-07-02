"use client";

import { useEffect, useState } from "react";
import { getToken } from "../../lib/auth";

export default function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        loadMyProducts();
    }, []);

    async function loadMyProducts() {
        try {
            // Note the specific route for "my" products
            const res = await fetch(`${API}/products/my-products`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            if (data.success) setProducts(data.products);
        } catch (error) {
            console.error("Error loading seller products:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Shop Inventory</h1>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    + Add New Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id} className="border-t">
                                <td className="p-4">{p.name}</td>
                                <td className="p-4">${p.price}</td>
                                <td className="p-4">{p.stock}</td>
                                <td className="p-4 text-sm">
                                    {p.stock > 0 ? "Active" : "Out of Stock"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}