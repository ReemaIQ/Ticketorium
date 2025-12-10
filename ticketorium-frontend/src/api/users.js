import { API_BASE } from "./config";

const BASE = `${API_BASE}/api`;

// ---------------- AUTH ----------------

export async function loginUser(payload) {
    const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.errMsg || "Login failed");
    return data.token;
}

export async function signupUser(payload) {
    const res = await fetch(`${BASE}/users/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.errMsg || "Signup failed");
    return data.token;
}

// ---------------- VALIDATION ----------------

export async function emailExists(email) {
    const res = await fetch(
        `${BASE}/users/email-exists/${encodeURIComponent(email)}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await res.json();
    return data.exists;
}

export async function usernameExists(username) {
    const res = await fetch(
        `${BASE}/users/username-exists/${encodeURIComponent(username)}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await res.json();
    return data.exists;
}

// ---------------- CURRENT USER ----------------

export async function fetchMe() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${BASE}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;

    return data.user;
}

// Get user by username (for event registrations loading)
// NOTE: This function's backend route needs to be implemented.
export async function fetchUserByUsername(username) {
    // Check if the user exists first (re-using existing validation)
    const existsRes = await fetch(
        `${BASE}/users/username-exists/${encodeURIComponent(username)}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const existsData = await existsRes.json();
    const exists = existsData.exists;
    if (!exists) return null;

    // --- MISSING BACKEND ROUTE ---
    // Assuming a new route: GET /api/users/by-username/:username is implemented
    // const userRes = await fetch(
    //   `${BASE}/users/by-username/${encodeURIComponent(username)}`,
    //   {
    //     method: "GET",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );
    // if (!userRes.ok) throw new Error("Failed to fetch user by username");
    // return userRes.json();

    console.warn(
        "fetchUserByUsername requires implementation of GET /api/users/by-username/:username on the backend."
    );
    return null;
}