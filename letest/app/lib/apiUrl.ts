const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bck2-dtr1.onrender.com/api";
const normalizedUrl = rawApiUrl.replace(/\/+$/, "");
export const API_URL = normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;
