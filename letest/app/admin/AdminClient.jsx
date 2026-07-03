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
  // Inside AdminClient.jsx
  useEffect(() => {
    const token = getToken();

    // 1. If no token, kick them out immediately
    if (!token) {
      console.log("No token found, redirecting to signin");
      router.replace("/signin");
      return;
    }

    // 2. Perform check
    fetch(`${API_URL}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Auth Check Response:", data); // <--- WATCH THIS IN YOUR CONSOLE!

        // IMPORTANT: Check the path to 'role'. 
        // Is it data.user.role or data.role? Adjust accordingly.
        const userRole = data.user?.role || data.role;

        if (data.success && userRole === "admin") {
          setCheckingAuth(false); // SUCCESS!
        } else {
          console.log("Validation failed. Success:", data.success, "Role:", userRole);
          // ONLY redirect if the server actually returned an error
          // Don't redirect just because the request was slow
          router.replace("/signin");
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
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