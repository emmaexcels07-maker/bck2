"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProductRow from "../components/product/AdminProductRow.jsx";
import { getToken, removeToken } from "../lib/auth.js";

const API_URL = "bck2-1.onrender.com";

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // NEW PRODUCT FORM
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // AUTH CHECK (admin only)
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
  }, [router]);

  // LOAD DATA BASED ON ACTIVE TAB
  useEffect(() => {
    if (!checkingAuth) {
      if (activeTab === "products") loadProducts();
      else if (activeTab === "orders") loadOrders();
      else if (activeTab === "users") loadUsers();
    }
  }, [checkingAuth, activeTab]);

  async function loadProducts() {
    setLoading(true);
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

  async function loadOrders() {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createProduct(e) {
    e.preventDefault();

    // Validation
    if (!name.trim() || !price || !stock || !category.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (Number(price) <= 0 || Number(stock) < 0) {
      alert("Price must be positive and stock cannot be negative");
      return;
    }

    if (!image) {
      alert("Please upload a product image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("category", category);
    if (image) formData.append("image", image);

    const token = getToken();

    try {
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
        alert("Product created successfully!");
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (err) {
      console.error("Create product error:", err);
      alert("An error occurred while creating the product");
    }
  }

  function handleLogout() {
    removeToken();
    router.replace("/signin");
  }

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Verifying admin access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4">
            {["products", "orders", "users", "inventory"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-8">
            {/* Create Product Form */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Product</h2>
              <form onSubmit={createProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 rounded px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price *"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    className="bg-gray-700 text-white placeholder-gray-400 rounded px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Stock *"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 rounded px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category *"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 rounded px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 text-white placeholder-gray-400 rounded px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="3"
                />
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="text-white"
                  />
                  {image && <span className="text-green-400">{image.name}</span>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
                >
                  Create Product
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Products</h2>
              {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : products.length === 0 ? (
                <div className="text-center text-gray-400">No products found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="bg-gray-700 text-gray-200">
                      <tr>
                        <th className="px-4 py-3">Image</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {products.map((product) => (
                        <AdminProductRow
                          key={product._id}
                          product={product}
                          onProductDeleted={() => loadProducts()}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Orders</h2>
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-400">No orders found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-700 transition">
                        <td className="px-4 py-3 font-mono text-xs">{order._id.slice(-8)}</td>
                        <td className="px-4 py-3">{order.customerName || "N/A"}</td>
                        <td className="px-4 py-3 font-bold text-green-400">
                          ${order.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "completed" ? "bg-green-900 text-green-200" :
                              order.status === "pending" ? "bg-yellow-900 text-yellow-200" :
                                "bg-gray-700 text-gray-200"
                            }`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Users</h2>
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center text-gray-400">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-700 transition">
                        <td className="px-4 py-3 font-semibold">{user.name}</td>
                        <td className="px-4 py-3 text-gray-400">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-red-900 text-red-200" : "bg-blue-900 text-blue-200"
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Inventory Management</h2>
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-400">No products found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200">
                    <tr>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Current Stock</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-700 transition">
                        <td className="px-4 py-3 font-semibold">{product.name}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3 font-bold">
                          <span className={product.stock > 10 ? "text-green-400" : product.stock > 0 ? "text-yellow-400" : "text-red-400"}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-green-400">${product.price?.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 10 ? "bg-green-900 text-green-200" :
                              product.stock > 0 ? "bg-yellow-900 text-yellow-200" :
                                "bg-red-900 text-red-200"
                            }`}>
                            {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
