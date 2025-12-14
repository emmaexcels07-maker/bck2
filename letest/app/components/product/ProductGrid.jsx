import { Product } from "../types/product.js";
import ProductCard from "./ProductCard.jsx";
import ProductSkeleton from "./ProductSkeleton.jsx";

export default function ProductGrid({ products, loading }: { products: Product[], loading: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
      {loading && [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  );
}
