import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";

const API_URL = "https://bck2-dtr1.onrender.com/api";
const PAGE_SIZE = 12;

export function useInfiniteProducts(filters) {
  return useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const qs = new URLSearchParams({
        ...filters,
        page: pageParam,
        limit: PAGE_SIZE,
      }).toString();

      const res = await apiClient(`${API_URL}/products/shop?${qs}`);
      const data = await res.json();

      return data.products;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
    keepPreviousData: true,
    staleTime: 60_000,
  });
}
