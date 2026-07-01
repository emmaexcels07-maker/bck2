"use client";

import { useState } from "react";
import { logout } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className = "" }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // If your logout function needs to be async in the future,
      // it is already structured to handle it:
      await logout();

      // Force a hard navigation to ensure state is completely cleared
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isLoggingOut
          ? "bg-red-400 cursor-not-allowed opacity-70"
          : "bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white"
        }
        ${className}
      `}
    >
      {isLoggingOut ? "Signing out..." : "Logout"}
    </button>
  );
}