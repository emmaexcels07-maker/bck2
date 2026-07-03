"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, Menu, ChevronRight } from "lucide-react";
import ProductCard from "../components/product/ProductCard";

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  // ... keep your existing useEffect data fetching ...

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 1. JUMIA-STYLE TOP NAV */}
      <nav className="bg-orange-600 text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black italic">JUMIA-CLONE</h1>
          <input className="w-1/2 p-2 rounded text-gray-900" placeholder="Search products..." />
          <button className="flex gap-2"><ShoppingBag /> Cart</button>
        </div>
      </nav>

      {/* 2. HERO + CATEGORY SIDEBAR */}
      <section className="max-w-7xl mx-auto py-6 grid grid-cols-12 gap-4">
        {/* Category Sidebar */}
        <div className="col-span-3 bg-white rounded-lg shadow-sm p-2 hidden md:block">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer text-sm">
              {cat.name} <ChevronRight size={16} />
            </div>
          ))}
        </div>

        {/* Hero Banner */}
        <div className="col-span-12 md:col-span-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg h-80 flex items-center p-12 text-white">
          <div>
            <h2 className="text-4xl font-bold mb-4">Mega Sale!</h2>
            <p className="mb-6">Up to 50% off on electronics</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded font-bold">Shop Now</button>
          </div>
        </div>
      </section>

      {/* 3. FLASH SALES SECTION (Urgency) */}
      <section className="max-w-7xl mx-auto py-6">
        <div className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold text-xl flex items-center gap-2"><Zap /> Flash Sales</h3>
          <span className="bg-white text-red-600 px-3 py-1 rounded font-mono font-bold">02:45:12</span>
        </div>
        <div className="bg-white p-6 grid grid-cols-2 md:grid-cols-5 gap-4 rounded-b-lg">
          {featured.slice(0, 5).map(product => (
            <div key={product._id} className="border p-2 text-center">
              <img src={product.image} className="h-32 mx-auto" />
              <p className="text-sm font-bold mt-2 text-red-600">₦{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRODUCT GRID */}
      <section className="max-w-7xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featured.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}