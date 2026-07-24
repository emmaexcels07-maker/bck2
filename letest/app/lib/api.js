export async function apiPost(url, data, token = null) {
    try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            cache: "no-store",
        });

        const text = await res.text();
        let body = null;

        if (text) {
            try {
                body = JSON.parse(text);
            } catch {
                // If response isn't JSON, return raw text
                body = text;
            }
        }

        if (!res.ok) {
            const message = (body && body.message) || `Request failed with status ${res.status}`;
            const err = new Error(message);
            // Attach original response body for debugging
            err.response = body;
            err.status = res.status;
            throw err;
        }

        return body;
    } catch (error) {
        // Re-throw so callers can handle or display the error
        throw error;
    }
}

// lib/api.ts
export async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store", // Or next: { revalidate: 60 }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();

    // 📍 PUT OPTION #1 HERE
    const productList = Array.isArray(data)
      ? data
      : Array.isArray(data.products)
      ? data.products
      : Array.isArray(data.data)
      ? data.data
      : [];

    return productList.filter((p) => p.isFeatured || p.featured === true);
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}
