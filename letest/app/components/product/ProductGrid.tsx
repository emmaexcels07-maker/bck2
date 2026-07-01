import { Product } from "../types/product";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

export default function ProductGrid({ 
  products, 
  loading = false, 
  skeletonCount = 8 
}: ProductGridProps) {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
      {/* Product List */}
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}

      {/* Loading Skeletons */}
      {loading && 
        Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductSkeleton key={`skeleton-${i}`} />
        ))
      }
    </div>
  );
}