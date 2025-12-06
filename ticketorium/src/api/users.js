// src/api/users.js
import { getApiBaseUrl } from "./client";

const BASE = `${getApiBaseUrl()}/api`;

// ---------------- AUTH ----------------

export async function loginUser(payload) {
    const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.errMsg || "Login failed");
    return data.token;
}

export async function signupUser(payload) {
    const res = await fetch(`${BASE}/users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.errMsg || "Signup failed");
    return data.token;
}

// ---------------- VALIDATION ----------------

export async function emailExists(email) {
    const res = await fetch(`${BASE}/users/email-exists/${encodeURIComponent(email)}`);
    return (await res.json()).exists;
}

export async function usernameExists(username) {
    const res = await fetch(`${BASE}/users/username-exists/${encodeURIComponent(username)}`);
    return (await res.json()).exists;
}

// ---------------- CURRENT USER ----------------

export async function fetchMe() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${BASE}/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) return null;

    return data.user;
}

// Get user by username (for event registrations loading)
// NOTE: This function's backend route needs to be implemented.
export async function fetchUserByUsername(username) {
    // Check if the user exists first (re-using existing validation)
    const existsRes = await fetch(`${BASE}/users/username-exists/${encodeURIComponent(username)}`);
    const exists = (await existsRes.json()).exists;
    if (!exists) return null;

    // --- MISSING BACKEND ROUTE ---
    // Assuming a new route: GET /api/users/by-username/:username is implemented
    // const userRes = await fetch(`${BASE}/users/by-username/${encodeURIComponent(username)}`);
    // if (!userRes.ok) throw new Error("Failed to fetch user by username");
    // return userRes.json();

    console.warn("fetchUserByUsername requires implementation of GET /api/users/by-username/:username on the backend.");
    return null;
}