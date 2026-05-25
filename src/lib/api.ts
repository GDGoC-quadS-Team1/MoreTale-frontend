import { getAccessToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function apiFetch(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && options.body) {
        headers.set("Content-Type", "application/json");
    }

    const token = getAccessToken();
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!response.ok) {
        throw new Error(`API ${response.status}: ${path}`);
    }

    return response.json();
}
