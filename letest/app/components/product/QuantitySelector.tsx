"use client";

import { useState } from "react";

interface Props {
  max: number;
  onChange: (quantity: number) => void;
  initialValue?: number; // Added for flexibility
}

export default function QuantitySelector({ max, onChange, initialValue = 1 }: Props) {
  const [quantity, setQuantity] = useState(initialValue);

  const handleChange = (value: number) => {
    const q = Math.min(Math.max(1, value), max);
    setQuantity(q);
    onChange(q);
  };

  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit shadow-sm">
      <button
        onClick={() => handleChange(quantity - 1)}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-r border-gray-200 text-gray-600"
      >
        −
      </button>

      <input
        type="number"
        value={quantity}
        min={1}
        max={max}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-12 h-10 text-center font-medium text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        onClick={() => handleChange(quantity + 1)}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l border-gray-200 text-gray-600"
      >
        +
      </button>
    </div>
  );
}