export async function apiClient(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
