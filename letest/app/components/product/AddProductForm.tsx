"use client";
import { useState } from "react";

interface AddProductFormState {
    name: string;
    price: string;
    description: string;
}

export default function AddProductForm() {
    const [formData, setFormData] = useState<AddProductFormState>({
        name: "",
        price: "",
        description: "",
    });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("description", formData.description);
        if (file) data.append("image", file);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: data,
            });
            alert("Product added successfully!");
            setFormData({ name: "", price: "", description: "" });
            setFile(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <input
                className="w-full p-2 border rounded"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <textarea
                className="w-full p-2 border rounded"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                Add Product
            </button>
        </form>
    );
}