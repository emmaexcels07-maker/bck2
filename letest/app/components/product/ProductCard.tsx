import AddToCartButton from "./AddToCartButton.js";
import { Product } from "../types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group bg-white rounded-xl shadow hover:shadow-lg transition">
      <img
        src={product.images[0]}
        alt={product.name}
        className="aspect-square object-cover rounded-t-xl"
        loading="lazy"
      />
      <div className="p-4 space-y-2">
        <h3 className="font-medium line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="font-semibold">${product.price}</span>
          {product.stock <= 0 && <span className="text-xs text-red-500">Out of stock</span>}
        </div>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
