import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Product } from "../components/types/product";

const API_URL = "https://bck2-dtr1.onrender.com/api";
const PAGE_SIZE = 12;

interface Filters {
  search?: string;
  category?: string;
  min?: string;
  max?: string;
}

export function useInfiniteProducts(filters: Record<string, string>) {
  return useInfiniteQuery<Product[]>({
    queryKey: ["products", filters],

    initialPageParam: 1, // ✅ REQUIRED in v5

    queryFn: async ({ pageParam }) => {
      const page = pageParam as number; // ✅ cast here

      const qs = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(filters).map(([k, v]) => [k, String(v)])
        ),
        page: String(page),
        limit: String(PAGE_SIZE),
      }).toString();

      const data = await apiClient(`${API_URL}/products/shop?${qs}`);
      return data.products;
    },

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE
        ? allPages.length + 1
        : undefined;
    },
  });
}
