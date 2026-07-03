"use client";

import { useState, useEffect } from "react";
import { getToken } from "../../lib/auth";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    form.append("description", description);
    form.append("stock", stock);
    form.append("category", category);
    if (imageFile) form.append("image", imageFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form
      });

      const data = await res.json();
      if (data.success) {
        alert("Product created successfully!");
        setName(""); setPrice(""); setDescription(""); setStock(""); setCategory("");
        setImageFile(null); setPreview(null);
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-gray-950 border border-gray-700 p-3 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Add New Product</h2>

      <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required />
      
      <div className="grid grid-cols-2 gap-4 my-4">
        <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" step="0.01" required />
        <input className={inputClass} value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock Quantity" type="number" required />
      </div>

      <input className={`${inputClass} mb-4`} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />

      <textarea className={`${inputClass} mb-4`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} required />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Product Image</label>
        <input type="file" onChange={handleImageChange} accept="image/*" className="text-gray-400 text-sm" />
        {preview && <img src={preview} alt="preview" className="mt-4 w-32 h-32 object-cover rounded-lg border border-gray-700" />}
      </div>

      <button
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}