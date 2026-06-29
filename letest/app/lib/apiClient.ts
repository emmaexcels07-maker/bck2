import { getToken } from "./auth";

export async function apiClient<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = getToken();

    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
      credentials: "include",
    });

    let data: unknown = null;

    const contentType = res.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const text = await res.text();
      data = text ? JSON.parse(text) : null;
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(
        typeof data === "object" && data !== null
          ? (data as any).message || `HTTP ${res.status}`
          : String(data || `HTTP ${res.status}`)
      );
    }

    return data as T;
  } catch (error) {
    console.error("API Client Error:", error);
    throw error;
  }
}