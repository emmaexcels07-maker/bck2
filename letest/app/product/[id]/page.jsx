"use client";
import { useEffect, useState } from "react";
import { useCart } from "../../lib/cartContext";

export default function ProductPage({ params }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://bck2-dtr1.onrender.com/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.product));
  }, []);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <img
        src={product.image}
        className="rounded-lg shadow-lg"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-xl text-blue-600 mt-2">${product.price}</p>
        <p className="mt-4 text-gray-600">{product.description}</p>

        <button
          onClick={() => addToCart(product)}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
