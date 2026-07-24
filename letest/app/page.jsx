"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-white flex flex-col justify-between p-6">
      {/* Background Glow Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.25),rgba(0,0,0,0))] pointer-events-none"
      />

      {/* Background Floating Decorative Cards */}
      <motion.div
        className="absolute w-56 md:w-72 aspect-square top-16 left-6 md:left-12 opacity-15 rotate-12 pointer-events-none hidden sm:block"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 0.15 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <Image
          src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg"
          alt="Decor sneakers"
          fill
          sizes="288px"
          className="object-cover rounded-2xl shadow-2xl"
        />
      </motion.div>

      <motion.div
        className="absolute w-56 md:w-72 aspect-square bottom-16 right-6 md:right-12 opacity-15 -rotate-6 pointer-events-none hidden sm:block"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 0.15 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      >
        <Image
          src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg"
          alt="Decor apparel"
          fill
          sizes="288px"
          className="object-cover rounded-2xl shadow-2xl"
        />
      </motion.div>

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/shop")}
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-indigo-400">Next</span>Shop
          </span>
        </motion.div>

        {/* Auth Navigation (Grouped Top Right) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => router.push("/signin")}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
          >
            Sign Up
          </button>
        </motion.div>
      </header>

      {/* HERO GLASS CARD */}
      <main className="relative z-10 flex-1 flex items-center justify-center my-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center p-8 md:p-12 max-w-2xl mx-auto bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Generation E-Commerce</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Welcome to <span className="text-indigo-400">NextShop</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Discover a curated collection of premium products with rapid delivery, 
            seamless checkout, and full account synchronization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/shop")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group"
            >
              <span>Explore Store</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-colors"
            >
              Create Account
            </button>
          </div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 text-center py-2 text-xs text-gray-500">
        © {new Date().getFullYear()} NextShop. Built with Next.js & Tailwind CSS.
      </footer>
    </div>
  );
}