import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Product } from "../components/types/product";

const API_URL = "https://bck2-dtr1.onrender.com/api";
const PAGE_SIZE = 12;

export function useInfiniteProducts(filters: Record<string, string>) {
  return useInfiniteQuery<Product[], unknown, Product[], ["products", Record<string, string>]>(
    {
      queryKey: ["products", filters],
      queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
        const qs = new URLSearchParams({
          ...Object.fromEntries(
            Object.entries(filters).map(([k, v]) => [k, String(v)])
          ),
          page: String(pageParam),
          limit: String(PAGE_SIZE),
        }).toString();

        const data = await apiClient(`${API_URL}/products/shop?${qs}`);
        return data.products;
      },
      getNextPageParam: (lastPage, pages) => {
        // Example logic: if lastPage has PAGE_SIZE products, fetch next page
        return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
      },
    }
  );
}
