"use client";
import Link from "next/link";
import { apiPost } from "../lib/api.js";
import { useState } from "react";
import { useRouter } from "next/navigation";   // <-- ADD THIS

export default function SignUpPage() {
  const router = useRouter();   // <-- ADD THIS

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();
  setIsSubmitting(true);
  setMessage(null);

  try {
    const res = await apiPost(
      "https://bck2-dtr1.onrender.com/api/auth/signup",
      { name, email, password }
    );

    console.log("Signup response:", res);

    // Accept signup success if backend returns a message or user object
    if (res?.user || res?.message?.toLowerCase().includes("successful")) {
      setMessage("Signup successful! Redirecting...");

      setTimeout(() => {
        router.push("/signin");
      }, 200);
      if (res?.message?.includes("already")) {
  setMessage("Email already exists. Try signing in instead.");
  return;
}
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
          <p className="text-center text-green-500 mb-2">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            placeholder="Full Name"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            placeholder="Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700"
            placeholder="Password"
          />

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
