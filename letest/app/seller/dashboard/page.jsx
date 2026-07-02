"use client";

import { useEffect, useState } from "react";
import { getToken } from "../../lib/auth";
import { Plus, Package, DollarSign, AlertCircle, Edit2, Trash2, Search } from "lucide-react";

export default function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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


    // Inside your SellerDashboard component
    const [isAdding, setIsAdding] = useState(false);



    // Inside your return JSX
    <button
        onClick={() => setIsAdding(!isAdding)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
        {isAdding ? "Cancel" : "+ Add New Product"}
    </button>

    {
        isAdding && (
            <div className="mt-6 p-6 bg-white border rounded-xl shadow-lg">
                <AddProductForm onSuccess={() => {
                    setIsAdding(false);
                    loadMyProducts(); // Refresh list after adding
                }} />
            </div>
        )
    }

    {
        isModalOpen && (
            <AddProductModal
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    loadMyProducts(); // Automatically refresh the table!
                }}
            />
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your shop inventory and sales.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                >
                    <Plus className="w-5 h-5" /> Add New Product
                </button>
            </div>

            {/* Stats Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: "Total Products", value: products.length, icon: Package, color: "text-blue-600" },
                    { label: "Total Sales", value: "$0.00", icon: DollarSign, color: "text-green-600" },
                    { label: "Low Stock", value: "2", icon: AlertCircle, color: "text-amber-600" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inventory Table */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Inventory</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <input placeholder="Search products..." className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length > 0 ? (
                            products.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="p-4 text-gray-600">${p.price}</td>
                                    <td className="p-4 text-gray-600">{p.stock} units</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.stock > 0
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}>
                                            {p.stock > 0 ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                    No products found. Start by adding your first item!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}