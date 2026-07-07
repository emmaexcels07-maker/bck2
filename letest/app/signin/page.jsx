"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost } from "../lib/api.js";
import { saveToken, saveUser } from "../lib/auth.js";
import { useState } from "react";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setMessage("Please enter email and password.");
            return;
        }

        setMessage(null);
        setIsSubmitting(true);

        try {
            const res = await apiPost(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
                email,
                password,
            });

            if (res && res.success && res.token) {
                saveToken(res.token);
                if (res.user) saveUser(res.user);

                if (res.user?.role === "seller") {
                    router.push("/seller/dashboard");
                    return;
                }

                if (res.user?.role === "admin") {
                    router.push("/admin");
                    return;
                }

                router.push("/home");
                return;
            }
            console.log("Sign in failed", res);


            setMessage(res?.message || "Sign in failed");
        } catch (err) {
            console.error("Signin error:", err);
            const friendly = err?.response?.message || err?.message || "An error occurred. Please try again.";
            setMessage(friendly);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center mb-6">Sign In</h2>
                {message && <p className="text-center text-red-500 mb-2">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700"
                        placeholder="Email"
                        aria-label="Email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700"
                        placeholder="Password"
                        aria-label="Password"
                    />
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white py-2 rounded-lg ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}