import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Product } from "../components/types/product";

const API_URL = "https://bck2-dtr1.onrender.com/api";
const PAGE_SIZE = 12;

export function useInfiniteProducts(filters: Record<string, string>) {
  return useInfiniteQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const qs = new URLSearchParams({ ...filters, page: pageParam, limit: PAGE_SIZE }).toString();
      const data = await apiClient(`${API_URL}/products/shop?${qs}`);
      return data.products;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
    keepPreviousData: true,
    staleTime: 60_000,
  });
}
