"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken } from "../lib/auth"; // Assume this exists

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Load product data
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
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId, API_URL]);

  // Memory Cleanup: Revoke object URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleFile(file) {
    if (!file) return;
    setImageFile(file);
    // Cleanup old preview
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));
    if (imageFile) form.append("image", imageFile);

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `${API_URL}/products/${productId}`);
    xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded * 100) / e.total));
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        alert("Updated successfully");
        router.push("/admin/products");
      } else {
        alert("Update failed. Please check your inputs.");
      }
      setProgress(0);
    };

    xhr.send(form);
  }

  if (loading) return <div className="p-8 text-center">Loading product data...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-black">← Back</button>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Product Name</label>
          <input className="w-full border p-3 rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Price ($)</label>
            <input type="number" step="0.01" className="w-full border p-3 rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Stock</label>
            <input type="number" className="w-full border p-3 rounded-lg" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea className="w-full border p-3 rounded-lg" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        {/* Upload Area */}
        <div 
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 p-8 rounded-xl text-center hover:border-indigo-500 cursor-pointer transition-colors"
          onClick={() => document.getElementById("filePicker").click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover mx-auto mb-4 rounded-lg" />
          ) : (
            <p className="text-gray-500">Drag image or click to replace</p>
          )}
          <input type="file" className="hidden" id="filePicker" onChange={(e) => handleFile(e.target.files[0])} accept="image/*" />
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <button 
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400"
          disabled={progress > 0}
        >
          {progress > 0 ? `Uploading (${progress}%)` : "Save Changes"}
        </button>
      </form>
    </div>
  );
}