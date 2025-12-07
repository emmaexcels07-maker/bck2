"use client";

import { useState, useEffect } from "react";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  // Safe client-only localStorage read
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
    }
  }, []);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageFile(file);

    // Preview
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !price || !desc.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("title", title);
    form.append("price", price);
    form.append("description", desc);
    if (imageFile) form.append("image", imageFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          //❌ DO NOT manually set Content-Type here
        },
        body: form
      });

      const data = await res.json();

      if (data.success) {
        alert("Product created successfully!");

        // Reset form
        setTitle("");
        setPrice("");
        setDesc("");
        setImageFile(null);
        setPreview(null);
      } else {
        console.error(data);
        alert(data.message || "Failed to create product");
      }
    } catch (error) {
      console.error(error);
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 border mb-3 rounded"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
        className="w-full p-3 border mb-3 rounded"
      />

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description"
        className="w-full p-3 border mb-3 rounded"
      />

      {/* IMAGE PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover rounded mb-3 border"
        />
      )}

      <input
        type="file"
        onChange={handleImageChange}
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
