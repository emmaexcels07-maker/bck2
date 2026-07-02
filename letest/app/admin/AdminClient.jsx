"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/fetch.js";
import { getToken, removeToken } from "../lib/auth.js";
import ProductsTab from "./products/page"; // Create these folders!
import OrdersTab from "./orders/page.jsx";
import UsersTab from "./users/page.jsx";
import InventoryTab from "./inventory/page.jsx";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://bck2-dtr1.onrender.com/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch(`${API_URL}/admin/users`);
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Unable to fetch users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (userId) => {
    try {
      const res = await apiFetch(`${API_URL}/admin/approve-seller/${userId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Promotion failed");
      }

      alert("User promoted to Seller!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Unable to promote user. Please try again.");
    }
  };



  // AUTH CHECK
  useEffect(() => {
    const token = getToken();
    if (!token) { router.replace("/signin"); return; }

    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (!data.success || data.user.role !== "admin") router.replace("/");
        else setCheckingAuth(false);
      })
      .catch(() => router.replace("/signin"));
  }, [router]);

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center text-white">Verifying Access...</div>;

  const tabs = [
    { id: "products", label: "Products", component: <ProductsTab /> },
    { id: "orders", label: "Orders", component: <OrdersTab /> },
    { id: "users", label: "Users", component: <UsersTab /> },
    { id: "inventory", label: "Inventory", component: <InventoryTab /> },
  ];


  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4 capitalize">{user.role}</td>
                  <td className="p-4">
                    {user.role === 'customer' && (
                      <button
                        onClick={() => handlePromote(user._id)}
                        className="text-green-600 font-bold hover:underline"
                      >
                        Promote to Seller
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Sidebar / Navigation Header */}
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
            <button onClick={() => { removeToken(); router.replace("/signin"); }} className="text-sm text-gray-400 hover:text-red-400">Logout</button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-900 rounded-xl border border-gray-800 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-gray-800 shadow-md text-white" : "text-gray-400 hover:text-white"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in duration-500">
            {tabs.find(t => t.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </>
  );
}