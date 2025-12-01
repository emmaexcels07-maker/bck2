"use client";
import Link from "next/link";
import { apiPost } from "../lib/api.js";
import { useState } from "react";


export default function SignUpPage() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState(null);


async function handleSubmit(e) {
e.preventDefault();
const res = await apiPost("https://bck2-2.onrender.com/api/v1/auth/signin", {
name,
email,
password,
});


if (res.success) {
window.location.href = "/signin";
return;
}
setMessage(res.message);
}


return (
<div className="min-h-screen flex items-center justify-center p-4">
<div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
<h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>
{message && <p className="text-center text-green-500 mb-2">{message}</p>}


<form onSubmit={handleSubmit} className="space-y-4">
<input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700" placeholder="Full Name" />
<input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700" placeholder="Email" />
<input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700" placeholder="Password" />
<button className="w-full bg-green-600 text-white py-2 rounded-lg">Create Account</button>
</form>


<p className="mt-4 text-center text-sm">Already have an account? <Link href="/signin" className="text-blue-500">Sign In</Link></p>
</div>
</div>
);
}