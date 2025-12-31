"use client";
import { useEffect, useState } from "react";
import { Product } from "../../components/types/product";

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/products").then(res => res.json())
            .then(d => setProducts(d.products));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Products</h1>

            {products.map(p => (
                <div key={p._id} className="flex justify-between border p-3 mb-2">
                    <span>{p.name}</span>
                    <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
