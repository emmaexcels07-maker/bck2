"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken } from "../../../../lib/auth";

export default function EditProductPage() {
    const router = useRouter();
    const { id: productId } = useParams();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [formData, setFormData] = useState({ name: "", price: "", description: "", stock: 0 });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API_URL}/products/${productId}`);
                const data = await res.json();
                if (data.success) {
                    const p = data.product;
                    setFormData({ name: p.name, price: p.price, description: p.description, stock: p.stock });
                    setPreview(p.images?.[0] || p.image);
                }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        }
        load();
    }, [productId, API_URL]);

    useEffect(() => {
        return () => { if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview); };
    }, [preview]);

    function handleFile(file: File | undefined) {
        if (!file) return;
        setImageFile(file);
        if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        const form = new FormData();
        Object.entries(formData).forEach(([key, val]) => form.append(key, val as string));
        if (imageFile) form.append("image", imageFile);

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `${API_URL}/products/${productId}`);
        xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded * 100) / e.total)); };
        xhr.onload = () => {
            if (xhr.status === 200) { alert("Updated successfully"); router.push("/admin/products"); }
            else { alert("Update failed."); setProgress(0); }
        };
        xhr.send(form);
    }

    const inputClass = "w-full bg-gray-950 border border-gray-700 p-3 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition";

    if (loading) return <div className="p-8 text-center text-gray-500">Loading product...</div>;

    return (
        <div className="max-w-3xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Edit Product</h2>
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition">← Back</button>
            </div>

            <form onSubmit={handleSave} className="bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-800 space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Product Name</label>
                    <input className={inputClass} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Price ($)</label>
                        <input type="number" className={inputClass} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Stock</label>
                        <input type="number" className={inputClass} value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Description</label>
                    <textarea className={inputClass} rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div
                    onClick={() => document.getElementById("filePicker")?.click()}
                    className="border-2 border-dashed border-gray-700 p-8 rounded-xl text-center hover:border-indigo-500 cursor-pointer transition-colors bg-gray-950/50"
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-32 h-32 object-cover mx-auto mb-4 rounded-lg" />
                    ) : (
                        <p className="text-gray-500">Drag image or click to replace</p>
                    )}
                    <input type="file" className="hidden" id="filePicker" onChange={(e) => handleFile(e.target.files?.[0])} accept="image/*" />
                </div>

                {progress > 0 && (
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold transition disabled:bg-gray-700" disabled={progress > 0}>
                    {progress > 0 ? `Uploading (${progress}%)` : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
