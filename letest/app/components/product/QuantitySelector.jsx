"use client";
import { useState } from "react";

interface Props {
  max: number;
  onChange: (quantity: number) => void;
}

export default function QuantitySelector({ max, onChange }: Props) {
  const [quantity, setQuantity] = useState(1);

  const handleChange = (value: number) => {
    const q = Math.min(Math.max(1, value), max);
    setQuantity(q);
    onChange(q);
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => handleChange(quantity - 1)} disabled={quantity <= 1}>-</button>
      <input
        type="number"
        value={quantity}
        min={1}
        max={max}
        onChange={e => handleChange(Number(e.target.value))}
        className="w-12 text-center border rounded"
      />
      <button onClick={() => handleChange(quantity + 1)} disabled={quantity >= max}>+</button>
    </div>
  );
}
