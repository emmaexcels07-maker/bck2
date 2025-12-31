"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Load product
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        const data = await res.json();

        if (data.success) {
          const p = data.product;
          setName(p.name);
          setPrice(p.price);
          setDescription(p.description);
          setStock(p.stock);
          setPreview(p.images?.[0] || p.image);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  // Drag & Drop
  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleImageSelect(e) {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    form.append("description", description);
    form.append("stock", stock.toString());
    if (imageFile) form.append("image", imageFile);

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `${API_URL}/products/${productId}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded * 100) / e.total));
      }
    };

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          alert("Updated successfully");
          router.push("/admin/products");
        } else {
          alert("Failed to update product");
        }
      } catch (error) {
        console.error("Failed to parse response:", error);
        alert("An error occurred");
      }
    };

    xhr.onerror = () => {
      alert("Network error occurred");
    };

    xhr.send(form);
  }

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      <form onSubmit={handleSave}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          placeholder="Product Name"
          required
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          placeholder="Price"
          type="number"
          step="0.01"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          placeholder="Description"
          rows="4"
        />

        <input
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="w-full border p-2 mb-3 rounded"
          type="number"
          placeholder="Stock quantity"
          min="0"
        />

        {/* Drag & Drop */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed p-6 text-center mb-3 rounded cursor-pointer"
          onClick={() => document.getElementById("filePicker").click()}
        >
          <p>Drag & drop image here or click to upload</p>

          <input type="file" className="hidden" id="filePicker" onChange={handleImageSelect} accept="image/*" />
        </div>

        {/* Preview */}
        {preview && (
          <img src={preview} className="w-40 h-40 object-cover rounded mb-3" alt="Preview" />
        )}

        {/* Progress bar */}
        {progress > 0 && (
          <div className="w-full bg-gray-200 h-3 rounded mb-3">
            <div
              className="bg-blue-600 h-3 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={progress > 0}>
          {progress > 0 ? `Uploading... ${progress}%` : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
