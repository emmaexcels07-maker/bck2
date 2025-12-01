"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 🔗 YOUR BACKEND URL
const API_URL = "https://bck2-dtr1.onrender.com/api/todos"; // update if needed

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function api(url, method = "GET", body = null) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
}

export default function TodoApp() {
  const router = useRouter();
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟦 LOAD TODOS FROM BACKEND
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }

    async function load() {
      const data = await api(API_URL);
      if (data.success) setTodos(data.todos);
      setLoading(false);
    }

    load();
  }, [router]);

  // 🟩 ADD TODO
  async function addTask() {
    if (!task.trim()) return;

    const data = await api(API_URL, "POST", { text: task });
    if (data.success) {
      setTodos(prev => [...prev, data.todo]);
      setTask("");
    }
  }

  // 🟨 TOGGLE DONE
  async function toggleDone(id, done) {
    const data = await api(`${API_URL}/${id}`, "PUT", { done: !done });
    if (data.success) {
      setTodos(prev => prev.map(t => (t._id === id ? data.todo : t)));
    }
  }

  // 🟥 DELETE TODO
  async function deleteTask(id) {
    const data = await api(`${API_URL}/${id}`, "DELETE");
    if (data.success) {
      setTodos(prev => prev.filter(t => t._id !== id));
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/signin");
  }

  if (loading)
    return <div className="p-6 text-center text-lg">Loading your tasks...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white shadow-xl p-6 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-center">To‑Do List</h1>
          <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={addTask}
            className="px-4 bg-blue-600 text-white rounded-lg"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t._id}
              className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
            >
              <span
                onClick={() => toggleDone(t._id, t.done)}
                className={`flex-1 cursor-pointer ${t.done ? "line-through text-gray-500" : ""}`}
              >
                {t.text}
              </span>
              <button
                onClick={() => deleteTask(t._id)}
                className="text-red-600 font-bold ml-3"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

