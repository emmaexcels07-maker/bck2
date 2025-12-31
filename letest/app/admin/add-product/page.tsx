"use client";

import { useState, useEffect } from "react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
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
    if (loading) return;

    if (!token) {
      alert("You must be logged in");
      return;
    }

    if (!name.trim() || !price || !description.trim() || !stock || !category.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (Number(price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (Number(stock) < 0) {
      alert("Stock cannot be negative");
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    form.append("description", description);
    form.append("stock", stock);
    form.append("category", category);
    if (imageFile) form.append("image", imageFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Product created successfully!");
        setName("");
        setPrice("");
        setDescription("");
        setStock("");
        setCategory("");
        setImageFile(null);
        setPreview(null);
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch {
      alert("Network error");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <input
        disabled={loading}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="w-full p-3 border mb-3 rounded"
        required
      />

      <input
        disabled={loading}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
        step="0.01"
        min="0"
        className="w-full p-3 border mb-3 rounded"
        required
      />

      <textarea
        disabled={loading}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-3 border mb-3 rounded"
        rows={4}
        required
      />

      <input
        disabled={loading}
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock Quantity"
        type="number"
        min="0"
        className="w-full p-3 border mb-3 rounded"
        required
      />

      <input
        disabled={loading}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full p-3 border mb-3 rounded"
        required
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover rounded mb-3 border"
        />
      )}

      <input
        disabled={loading}
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="mb-4"
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
