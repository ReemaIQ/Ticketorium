import { getApiBaseUrl } from "./client";

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(email, password) {
    const url = `${getApiBaseUrl()}/api/auth/login`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Login failed");
    }

    // Returns { token, user: {...} }
    return res.json();
}

/**
 * Register user
 * POST /api/auth/register
 */
export async function register(userData) {
    const url = `${getApiBaseUrl()}/api/auth/register`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Registration failed");
    }

    // Returns { token, user: {...} }
    return res.json();
}

/**
 * Get current user profile (This fixes the 'fetchMe' error)
 * GET /api/auth/me
 */
export async function fetchMe(token) {
    const url = `${getApiBaseUrl()}/api/auth/me`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user profile");
    }

    // Returns { user: {...} }
    return res.json();
}