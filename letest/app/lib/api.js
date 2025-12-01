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
