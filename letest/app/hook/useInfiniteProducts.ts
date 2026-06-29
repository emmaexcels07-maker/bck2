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

interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  pages?: number;
}

export function useInfiniteProducts(filters: Filters = {}) {
  return useInfiniteQuery({
    queryKey: ["products", filters],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );

      const qs = new URLSearchParams({
        ...cleanFilters,
        page: String(pageParam),
        limit: String(PAGE_SIZE),
      });

      const data = await apiClient<ProductsResponse>(
        `${API_URL}/products/shop?${qs}`
      );

      return data;
    },

    getNextPageParam: (lastPage, allPages) => {
      // Prefer backend pagination info if available
      if (lastPage.pages && lastPage.page) {
        return lastPage.page < lastPage.pages
          ? lastPage.page + 1
          : undefined;
      }

      // Fallback
      return lastPage.products.length === PAGE_SIZE
        ? allPages.length + 1
        : undefined;
    },

    select: (data) => ({
      ...data,
      pages: data.pages.flatMap((page) => page.products),
    }),
  });
}