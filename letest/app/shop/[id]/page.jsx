import ProductDetail from "../../components/product/ProductDetail.jsx";
import { apiClient } from "../../lib/apiClient.ts";
import { Product } from "../../components/types/product.ts";

interface Props { params: { id: string } }

export default async function ProductPage({ params }: Props) {
  const product: Product = await apiClient(
    `https://bck2-dtr1.onrender.com/api/products/${params.id}`
  );

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <ProductDetail product={product} />
    </main>
  );
}

// SEO metadata
export async function generateMetadata({ params }: Props) {
  const product: Product = await apiClient(
    `https://bck2-dtr1.onrender.com/api/products/${params.id}`
  );
  return {
    title: product.name,
    description: `Buy ${product.name} for $${product.price}`,
  };
}
