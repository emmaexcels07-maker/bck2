"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">

      {/* 🌟 Animated Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,122,255,0.3),rgba(0,0,0,0))]"
      />

      {/* 🌟 Floating Product Images */}
      <motion.img
        src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg"
        className="absolute w-64 md:w-80 top-20 left-10 opacity-20 rotate-12"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      <motion.img
        src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg"
        className="absolute w-64 md:w-80 bottom-16 right-10 opacity-20 -rotate-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {/* LOGO TOP LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-6 left-6 text-2xl font-bold"
      >
        <span className="text-blue-500">Next</span>Shop
      </motion.div>

      {/* SIGN IN BUTTON (TOP RIGHT) */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        onClick={() => router.push("/signin")}
        className="absolute top-6 right-6 px-5 py-2 rounded-lg bg-white/10 backdrop-blur-md 
                  border border-white/20 hover:bg-white/20 transition"
      >
        Sign In
      </motion.button>

      {/* SIGN UP BUTTON (BOTTOM RIGHT) */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2 }}
        onClick={() => router.push("/signup")}
        className="absolute bottom-6 right-6 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 
                  transition shadow-lg"
      >
        Sign Up
      </motion.button>

      {/* GLASS HERO CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        className="relative z-10 text-center p-8 md:p-12 max-w-3xl mx-auto 
                   bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-wide">
          Welcome to <span className="text-blue-500">NextShop</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          A modern, fast, secure shopping experience.  
          Browse thousands of high-quality products — beautifully presented.
        </p>

        <button
          onClick={() => router.push("/shop")}
          className="px-8 py-3 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        >
          Enter Store
        </button>
      </motion.div>
    </div>
  );
}
