"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

interface UserData {
  role?: string;
  [key: string]: unknown;
}

export default function AdminLink() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    // 1. Read user data safely after mount to prevent hydration mismatches
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    } finally {
      setIsMounted(true);
    }

    // 2. Optional: Listen for localStorage changes across the app
    const handleStorageChange = () => {
      try {
        const updatedUser = localStorage.getItem("user");
        setUser(updatedUser ? JSON.parse(updatedUser) : null);
      } catch (err) {
        console.error("Error syncing user state:", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Do not render anything during SSR or if user is not an admin
  if (!isMounted || user?.role?.toLowerCase() !== "admin") {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors shadow-sm"
    >
      <ShieldAlert className="w-3.5 h-3.5" />
      <span>Admin Dashboard</span>
    </Link>
  );
}