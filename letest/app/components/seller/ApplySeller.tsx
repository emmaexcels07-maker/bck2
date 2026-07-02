// components/seller/ApplySeller.tsx
"use client";
import { apiPost } from "../../lib/api";

export default function ApplySellerButton() {
  async function handleApply() {
    try {
      await apiPost("/api/users/apply-seller", {});
      alert("Application submitted! We will review your shop soon.");
    } catch (error) {
      alert("Error submitting application.");
    }
  }

  return (
    <button onClick={handleApply} className="bg-indigo-600 text-white px-4 py-2 rounded">
      Apply to become a Seller
    </button>
  );
}