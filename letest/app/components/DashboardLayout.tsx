"use client";

import { NAV_LINKS } from "../navigation.config";
import Link from "next/link";

type DashboardUser = {
    role?: string;
};

type NavLink = {
    label: string;
    path: string;
};

type DashboardLayoutProps = {
    children: React.ReactNode;
    user: DashboardUser;
};

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const role = user?.role || "seller";
    const links: NavLink[] = NAV_LINKS[role as keyof typeof NAV_LINKS] || [];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-8 text-indigo-600">Merchant Portal</h2>
                <nav className="space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className="block p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t">
                    <p className="text-sm text-gray-500">Logged in as: <span className="font-bold capitalize">{role}</span></p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}