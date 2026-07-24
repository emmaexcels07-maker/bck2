"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../lib/auth.js";

import ProductsTab from "./products/page";
import OrdersTab from "./orders/page";
import UsersTab from "./users/page";
import InventoryTab from "./inventory/page";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [status, setStatus] = useState("loading"); // 'loading' | 'authenticated' | 'unauthenticated'

  const handleLogout = useCallback(() => {
    removeToken();
    router.replace("/signin");
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      const token = getToken();

      // Short-circuit early if no token exists
      if (!token) {
        if (isMounted) {
          setStatus("unauthenticated");
          router.replace("/signin");
        }
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const userRole = data.user?.role || data.role;

        if (isMounted) {
          if (res.ok && data.success && userRole === "admin") {
            setStatus("authenticated");
          } else {
            setStatus("unauthenticated");
            router.replace("/signin");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (isMounted) {
          setStatus("unauthenticated");
          router.replace("/signin");
        }
      }
    }

    checkAccess();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const tabs = useMemo(
    () => [
      { id: "products", label: "Products" },
      { id: "orders", label: "Orders" },
      { id: "users", label: "Users" },
      { id: "inventory", label: "Inventory" },
    ],
    []
  );

  // Loading state spinner
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2" />
        <p className="text-sm font-medium">Verifying secure access...</p>
      </div>
    );
  }

  // Prevent UI flashing during unauthenticated redirect
  if (status === "unauthenticated") {
    return <div className="min-h-screen bg-gray-950" />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Top Bar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-800 hover:bg-red-900/30 px-3 py-1.5 rounded-md transition-colors text-gray-300 hover:text-red-400 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
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

        {/* Dynamic Lazy Tab Content */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "inventory" && <InventoryTab />}
        </section>
      </main>
    </div>
  );
}