import { API_BASE } from "./config";

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(email, password) {
    const url = `${API_BASE}/api/auth/login`;
    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Login failed");
    }

    // Returns { token, user: {...} } (and sets cookies if backend does)
    return res.json();
}

/**
 * Register user
 * POST /api/auth/register
 */
export async function register(userData) {
    const url = `${API_BASE}/api/auth/register`;
    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Registration failed");
    }

    // Returns { token, user: {...} } (and sets cookies if backend does)
    return res.json();
}

/**
 * Get current user profile
 * GET /api/auth/me
 */
export async function fetchMe(token) {
    const url = `${API_BASE}/api/auth/me`;
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            // keep Authorization if you're still using token in parallel with cookies
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user profile");
    }

    // Returns { user: {...} }
    return res.json();
}
