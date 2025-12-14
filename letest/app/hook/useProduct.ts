import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient.ts";
import { Product } from "../components/types/product.ts";

const API_URL = "https://bck2-dtr1.onrender.com/api";

export function useProduct(productId: string) {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      return apiClient(`${API_URL}/products/${productId}`);
    },
    staleTime: 60_000,
  });
}
