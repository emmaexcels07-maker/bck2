import { getToken, removeToken } from "./auth";

export async function apiClient(url: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    removeToken();
    window.location.href = "/signin";
    throw new Error("Unauthorized");
  }

  return res;
}
