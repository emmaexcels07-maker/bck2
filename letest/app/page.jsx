"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, saveToken  } from "./lib/auth.js";

const API_URL = "https://bck2-dtr1.onrender.com/api/v1/todos";

async function apiRequest(url, method = "GET", body = null) {
  const token = getToken();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
}

export default function TodoApp() {
  const router = useRouter();
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }

    async function loadTodos() {
      const data = await apiRequest(API_URL);
      if (data.success) setTodos(data.todos);
      setLoading(false);
    }

    loadTodos();
  }, []);

  async function addTask() {
    if (!task.trim()) return;

    const data = await apiRequest(API_URL, "POST", { text: task });
    if (data.success) {
      setTodos([...todos, data.todo]);
      setTask("");
    }
  }

  async function toggleDone(id, done) {
    const data = await apiRequest(`${API_URL}/${id}`, "PUT", {
      done: !done,
    });

    if (data.success) {
      setTodos(todos.map(t => (t._id === id ? data.todo : t)));
    }
  }

  async function deleteTask(id) {
    const data = await apiRequest(`${API_URL}/${id}`, "DELETE");

    if (data.success) {
      setTodos(todos.filter(t => t._id !== id));
    }
  }

  function handleLogout() {
    removeToken();
    router.replace("/signin");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">To-Do List</h1>
        <button onClick={handleLogout} className="text-red-600">
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={task}
          onChange={e => setTask(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(t => (
          <li key={t._id} className="flex justify-between p-2 bg-gray-200 rounded">
            <span
              onClick={() => toggleDone(t._id, t.done)}
              className={`cursor-pointer ${t.done ? "line-through text-gray-500" : ""}`}
            >
              {t.text}
            </span>
            <button onClick={() => deleteTask(t._id)} className="text-red-600 font-bold">
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


