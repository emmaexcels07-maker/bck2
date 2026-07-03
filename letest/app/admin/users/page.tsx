"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../../app/lib/fetch";

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
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
        method: "POST" 
      });
      
      if (res.ok) {
        // Optimistically update the list locally for better UX
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: 'seller' } : u));
      } else {
        alert("Failed to promote user.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-950/50 border-b border-gray-800">
          <tr>
            <th className="p-4 text-gray-400 font-semibold text-sm">Name</th>
            <th className="p-4 text-gray-400 font-semibold text-sm">Role</th>
            <th className="p-4 text-gray-400 font-semibold text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
              <td className="p-4 text-gray-200">{user.name}</td>
              <td className="p-4">
                <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-900/30 text-purple-300' :
                  user.role === 'seller' ? 'bg-blue-900/30 text-blue-300' : 
                  'bg-gray-800 text-gray-400'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4 text-right">
                {user.role === 'customer' && (
                  <button 
                    onClick={() => handlePromote(user._id)} 
                    disabled={processingId === user._id}
                    className="text-green-400 hover:text-green-300 transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    {processingId === user._id ? "Processing..." : "Promote to Seller"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}