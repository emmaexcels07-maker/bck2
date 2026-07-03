"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../lib/auth.js";// AdminClient.jsx
// Assuming you have a page.jsx inside each folder
import ProductsTab from "./products/page";
import OrdersTab from "./orders/page";
import UsersTab from "./users/page";
import InventoryTab from "./inventory/page";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // AUTH CHECK
  useEffect(() => {
    const token = getToken();
    if (!token) { router.replace("/signin"); return; }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then((data) => {
        console.log("Auth Check Response:", data);
        if (!data.success || data.user?.role !== "admin") {
          console.log("Redirecting because:", !data.success ? "Auth failed" : "Not an admin");
          router.replace("/");
        } else {
          setCheckingAuth(false);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        router.replace("/signin");
      });
  }, [router]);

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center">Verifying Access...</div>;

  const tabs = [
    { id: "products", label: "Products", component: <ProductsTab /> },
    { id: "orders", label: "Orders", component: <OrdersTab /> },
    { id: "users", label: "Users", component: <UsersTab /> },
    { id: "inventory", label: "Inventory", component: <InventoryTab /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button onClick={() => { removeToken(); router.replace("/signin"); }} className="text-sm text-gray-400 hover:text-red-400">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 p-1 bg-gray-900 rounded-xl border border-gray-800 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-500">
          {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}