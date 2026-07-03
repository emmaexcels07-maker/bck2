"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../lib/auth.js";

// Import components normally
import ProductsTab from "./products/page";
import OrdersTab from "./orders/page";
import UsersTab from "./users/page";
import InventoryTab from "./inventory/page";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [status, setStatus] = useState("loading"); // 'loading' | 'authenticated' | 'unauthenticated'

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      const token = getToken();

      if (!token) {
        router.replace("/signin");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        const userRole = data.user?.role || data.role;

        if (isMounted) {
          if (res.ok && data.success && userRole === "admin") {
            setStatus("authenticated");
          } else {
            router.replace("/signin");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (isMounted) router.replace("/signin");
      }
    }

    checkAccess();
    return () => { isMounted = false; };
  }, [router]);

  // Memoize tabs to prevent unnecessary re-renders
  const tabs = useMemo(() => [
    { id: "products", label: "Products", component: <ProductsTab /> },
    { id: "orders", label: "Orders", component: <OrdersTab /> },
    { id: "users", label: "Users", component: <UsersTab /> },
    { id: "inventory", label: "Inventory", component: <InventoryTab /> },
  ], []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2" />
        Verifying secure access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
          <button 
            onClick={() => { removeToken(); router.replace("/signin"); }} 
            className="text-sm bg-gray-800 hover:bg-red-900/30 px-3 py-1.5 rounded-md transition-colors text-gray-300 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 p-1 bg-gray-900 rounded-xl border border-gray-800 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                ? "bg-gray-800 text-white shadow-sm" 
                : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {tabs.find(t => t.id === activeTab)?.component}
        </section>
      </main>
    </div>
  );
}