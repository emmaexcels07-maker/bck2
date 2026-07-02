"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react"; // FIX 1: Added import
import LogoutButton from "../components/LogoutButton";
import ProductCard from "../components/product/ProductCard";
import CartDrawer from "../components/CartDrawer"; // FIX: Ensure this is imported
import { getToken } from "../lib/auth";
import { apiFetch } from "../lib/fetch";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false); // FIX 2: Moved up

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }

    async function loadData() {
      try {
        const [catsRes, productsRes] = await Promise.all([
          apiFetch(`${API_URL}/categories`),
          apiFetch(`${API_URL}/products?featured=true`),
        ]);

        // FIX 3: Check if responses are OK before parsing JSON
        if (!catsRes.ok || !productsRes.ok) {
           throw new Error("Network response was not ok");
        }

        const catsData = await catsRes.json();
        const featData = await productsRes.json();
        
        if (catsData.success) setCategories(catsData.categories);
        if (featData.success) setFeatured(featData.products);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">Loading storefront...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">NextShop</h2>
          
          <div className="flex items-center gap-4">
            {/* FIX 4: Corrected Button Logic */}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2">
              <ShoppingBag className="w-6 h-6" />
            </button>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* ... rest of your UI (Hero, Featured, Categories) ... */}
    </div>
  );
}