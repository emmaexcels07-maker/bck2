"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    }

    load();
  }, []);

  async function updateRole(id, newRole) {
    await fetch(`${API}/admin/users/${id}/role`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: newRole })
    });
    alert("Updated!");
    location.reload();
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API}/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Deleted");
    location.reload();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">User Manager</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td className="space-x-3">
                <button
                  onClick={() => updateRole(u._id, "admin")}
                  className="text-blue-600"
                >
                  Make Admin
                </button>
                <button
                  onClick={() => deleteUser(u._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
