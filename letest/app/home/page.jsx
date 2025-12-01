"use client";
import { getToken, removeToken } from "@/lib/auth";
import { useEffect } from "react";


export default function HomePage() {
useEffect(() => {
const token = getToken();
if (!token) window.location.href = "/signin";
}, []);


return (
<div className="min-h-screen flex items-center justify-center dark:text-white p-4">
<div className="text-center">
<h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
<button onClick={() => { removeToken(); window.location.href = "/signin"; }} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Logout</button>
</div>
</div>
);
}