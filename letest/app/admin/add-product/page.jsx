"use client";
import { useState } from "react";

export default function AddProduct() {
  const [title,setTitle]=useState("");
  const [price,setPrice]=useState("");
  const [desc,setDesc]=useState("");
  const [imageFile,setImageFile]=useState(null);

  async function handleSubmit(e){
    e.preventDefault();
    const form = new FormData();
    form.append("title", title);
    form.append("price", price);
    form.append("description", desc);
    if (imageFile) form.append("image", imageFile);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: form
    });
    const data = await res.json();
    if (data.success) alert("Product created");
    else alert("Failed");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border mb-2" />
      <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" type="number" className="w-full p-2 border mb-2" />
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="w-full p-2 border mb-2" />
      <input type="file" onChange={e=>setImageFile(e.target.files[0])} className="mb-4" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
    </form>
  );
}
