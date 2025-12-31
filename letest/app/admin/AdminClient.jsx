"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProductRow from "../components/product/AdminProductRow.jsx";
import { getToken, removeToken } from "../lib/auth.js";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminClient() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW PRODUCT FORM
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // AUTH CHECK (admin only)
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }

    async function verifyAdmin() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success || data.user.role !== "admin") {
          router.replace("/");
          return;
        }
        setCheckingAuth(false);
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.replace("/signin");
      }
    }

    verifyAdmin();
  }, []);

  // LOAD PRODUCTS
  useEffect(() => {
    if (!checkingAuth) {
      loadProducts();
    }
  }, [checkingAuth]);

  async function loadProducts() {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createProduct(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("category", category);
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
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setCategory("");
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
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          required
          type="number"
          step="0.01"
          min="0"
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
          rows={3}
        />

        <input
          required
          type="number"
          min="0"
          className="p-3 rounded border"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          required
          className="p-3 rounded border"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
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
            <th className="p-3">Name</th>
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
