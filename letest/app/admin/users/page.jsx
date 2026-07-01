"use client";

import { useEffect, useState } from "react";
import { getToken } from "../lib/auth"; // Assume this abstracts localStorage access

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }

  // Optimistic UI Update: Update local state immediately
  async function updateRole(id, newRole) {
    const previousUsers = [...users]; // Keep a backup for rollback
    
    // 1. Update UI immediately
    setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));

    try {
      const res = await fetch(`${API}/admin/users/${id}/role`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${getToken()}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!res.ok) throw new Error();
    } catch (error) {
      setUsers(previousUsers); // Rollback on failure
      alert("Failed to update role. Changes reverted.");
    }
  }

  // Optimistic UI Delete
  async function deleteUser(id) {
    if (!confirm("Are you sure? This action is permanent.")) return;

    const previousUsers = [...users];
    setUsers(users.filter(u => u._id !== id)); // Remove immediately

    try {
      const res = await fetch(`${API}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (!res.ok) throw new Error();
    } catch (error) {
      setUsers(previousUsers); // Rollback
      alert("Failed to delete user.");
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading directory...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Directory</h1>
        <span className="text-sm text-gray-500">{users.length} Total Users</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700">User</th>
              <th className="p-4 font-semibold text-gray-700">Role</th>
              <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 space-x-4">
                  {u.role !== "admin" && (
                    <button onClick={() => updateRole(u._id, "admin")} className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                      Promote to Admin
                    </button>
                  )}
                  <button onClick={() => deleteUser(u._id)} className="text-sm text-red-600 font-medium hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}