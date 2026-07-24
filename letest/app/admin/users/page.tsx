"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../../app/lib/fetch";
import { Loader2, ShieldCheck, UserCheck, Users, AlertCircle } from "lucide-react";

interface User {
  _id: string;
  name?: string;
  email?: string;
  role: "admin" | "seller" | "customer" | string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        // Handle both direct arrays and wrapped responses ({ success: true, users: [...] })
        const userList = Array.isArray(data) ? data : data.users || data.data || [];
        setUsers(userList);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePromote = async (userId: string) => {
    if (!window.confirm("Promote this user to Seller?")) return;

    setProcessingId(userId);
    try {
      const res = await apiFetch(`${API_URL}/admin/approve-seller/${userId}`, {
        method: "POST",
      });

      if (res.ok) {
        // Optimistically update the list locally
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: "seller" } : u))
        );
      } else {
        alert("Failed to promote user.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing the request.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> User Management
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage permissions, review seller applications, and update roles.
          </p>
        </div>
        <span className="text-xs font-mono bg-gray-800 text-gray-400 px-3 py-1 rounded-full border border-gray-700">
          {users.length} Total Users
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-950/60 border-b border-gray-800">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                User Details
              </th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-4">
                    <div className="h-4 bg-gray-800 rounded w-48 mb-2" />
                    <div className="h-3 bg-gray-800/60 rounded w-32" />
                  </td>
                  <td className="p-4">
                    <div className="h-5 bg-gray-800 rounded-full w-16" />
                  </td>
                  <td className="p-4 text-right">
                    <div className="h-8 bg-gray-800 rounded w-28 ml-auto" />
                  </td>
                </tr>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-800/40 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-200">
                      {user.name || "Unnamed User"}
                    </div>
                    {user.email && (
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">
                        {user.email}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize border ${
                        user.role === "admin"
                          ? "bg-purple-950/40 text-purple-300 border-purple-800/50"
                          : user.role === "seller"
                          ? "bg-blue-950/40 text-blue-300 border-blue-800/50"
                          : "bg-gray-800/60 text-gray-400 border-gray-700/50"
                      }`}
                    >
                      {user.role === "admin" && (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      {user.role === "seller" && (
                        <UserCheck className="w-3.5 h-3.5" />
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {user.role === "customer" ? (
                      <button
                        onClick={() => handlePromote(user._id)}
                        disabled={processingId === user._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/40 hover:text-emerald-300 rounded-lg transition-all text-xs font-semibold disabled:opacity-50"
                      >
                        {processingId === user._id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          "Promote to Seller"
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-12 text-center text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-300">
                    No registered users found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}