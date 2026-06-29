import { getToken } from "./auth";

export async function apiClient(url: string, options: RequestInit = {}) {
  try {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
      credentials: "include",
    });

    // Handle empty responses
    const contentType = res.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const error = new Error(
        typeof data === "object" ? data.message || "API Error" : data
      );
      throw error;
    }

    return data;
  } catch (err) {
    console.error("API Client Error:", err);
    throw err;
  }
}
