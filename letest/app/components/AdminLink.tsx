"use client";
import { useEffect, useState } from "react";

interface UserData {
    role?: string;
}

export default function AdminLink() {
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        const userData = rawUser ? JSON.parse(rawUser) : null;
        setUser(userData);
    }, []);

    if (user?.role !== "admin") return null;

    return (
        <a href="/admin" className="text-red-600 font-bold">
            Admin Dashboard
        </a>
    );
}