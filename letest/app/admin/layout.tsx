"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // 1. Get user data from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        // 2. Protect: If not admin, kick them out
        if (user?.role !== "admin") {
            router.replace("/");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) return <div>Checking authorization...</div>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6">
                <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-4">
                    <Link href="/admin" className="block p-2 hover:bg-slate-700 rounded">Dashboard</Link>
                    <Link href="/admin/users" className="block p-2 hover:bg-slate-700 rounded">Manage Users</Link>
                </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}