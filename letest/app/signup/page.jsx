"use client";

import Link from "next/link";
import { apiPost } from "../lib/api.js";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // NEW: Add state for role
  const [role, setRole] = useState("customer"); 
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // NEW: Send 'role' in the object
      const res = await apiPost(
        "https://bck2-dtr1.onrender.com/api/auth/signup",
        { name, email, password, role } 
      );

      if (res?.user || res?.message?.toLowerCase().includes("successful")) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => router.push("/signin"), 1500);
        return;
      }

      setMessage(res?.message || "Signup failed.");
    } catch (err) {
      console.error("Signup Error:", err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>

        {message && (
          <p className="text-center text-green-500 mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            placeholder="Full Name"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            placeholder="Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            placeholder="Password"
            required
          />

          <input
            type="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            placeholder="Role (customer/seller/admin)"
            required
          />

          {/* NEW: Role Selection Dropdown */}
          <div className="space-y-1">
            <label className="text-sm text-gray-500">I want to:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="customer">Buy Products</option>
              <option value="seller">Sell Products</option>
              <option value="admin">Admin Access</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-600 text-white py-2 rounded-lg ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Signing up..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}