"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProductRow from "../components/AdminProductRow.jsx";
import { getToken, removeToken } from "../lib/auth.js";

const API_URL = "https://bck2-dtr1.onrender.com/api";

export default function AdminClient() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW PRODUCT FORM
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // AUTH CHECK (admin only)
  useEffect(() => {
    const token = getToken();
    if (!token) return router.replace("/signin");

    async function verifyAdmin() {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success || data.user.role !== "admin") {
        router.replace("/");
      }
    }

    verifyAdmin();
  }, []);

  // LOAD PRODUCTS
  useEffect(() => {
    async function loadProducts() {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
      setLoading(false);
    }
    loadProducts();
  }, []);

  async function createProduct(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    if (image) formData.append("image", image);

    const token = getToken();

    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setProducts((prev) => [data.product, ...prev]);
      setTitle("");
      setPrice("");
      setDescription("");
      setImage(null);
    }
  }

  if (loading) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            removeToken();
            router.replace("/signin");
          }}
          className="text-red-400"
        >
          Logout
        </button>
      </div>

      {/* CREATE PRODUCT FORM */}
      <form
        onSubmit={createProduct}
        className="bg-white text-black p-6 rounded-xl shadow mb-10 grid gap-4"
      >
        <h2 className="text-xl font-bold">Add New Product</h2>

        <input
          required
          className="p-3 rounded border"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          required
          type="number"
          className="p-3 rounded border"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          required
          className="p-3 rounded border"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          className="p-3 border rounded"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="bg-blue-700 text-white p-3 rounded-lg">
          Create Product
        </button>
      </form>

      {/* PRODUCT TABLE */}
      <table className="w-full bg-white text-black rounded-xl overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <AdminProductRow
              key={p._id}
              product={p}
              onDelete={() =>
                setProducts((prev) => prev.filter((x) => x._id !== p._id))
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
