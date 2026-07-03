"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../app/lib/fetch"; // Adjust path as needed

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchUsers = async () => {
    try {
      const res = await apiFetch(`${API_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handlePromote = async (userId) => {
    const res = await apiFetch(`${API_URL}/admin/approve-seller/${userId}`, { method: "POST" });
    if (res.ok) {
      alert("Promoted!");
      fetchUsers();
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-4 text-gray-300">Name</th>
            <th className="p-4 text-gray-300">Role</th>
            <th className="p-4 text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t border-gray-800">
              <td className="p-4">{user.name}</td>
              <td className="p-4 capitalize">{user.role}</td>
              <td className="p-4">
                {user.role === 'customer' && (
                  <button onClick={() => handlePromote(user._id)} className="text-green-500 hover:underline">
                    Promote to Seller
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