"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import { getToken } from "../../lib/auth";

interface AddProductModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface AddProductFormData {
    name: string;
    price: string;
    stock: string;
    description: string;
}

export default function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
    const [formData, setFormData] = useState<AddProductFormData>({ name: "", price: "", stock: "", description: "" });
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        (Object.keys(formData) as Array<keyof AddProductFormData>).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (file) data.append("image", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: data, // DO NOT set Content-Type header! Browser does it automatically.
            });

            if (res.ok) {
                onSuccess(); // Close modal and refresh table
            } else {
                alert("Failed to add product");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Add New Product</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full p-3 border rounded-lg" placeholder="Product Name" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" className="p-3 border rounded-lg" placeholder="Price" required onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                        <input type="number" className="p-3 border rounded-lg" placeholder="Stock" required onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                    </div>
                    <textarea
                        className="w-full p-3 border rounded-lg"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <input
                        type="file"
                        className="w-full p-3 border rounded-lg"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)}
                    />

                    <button disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 flex justify-center items-center gap-2">
                        {isSubmitting ? <><Loader2 className="animate-spin" /> Saving...</> : "Save Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}