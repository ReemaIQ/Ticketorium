// src/api/users.js

const BASE = "http://localhost:4000/api";

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
export async function fetchUserByUsername(username) {
    const res = await fetch(`${BASE}/users/username-exists/${encodeURIComponent(username)}`);
    const exists = (await res.json()).exists;
    if (!exists) return null;

    // Your backend does NOT have "get user by username"
    // If needed I will create that route.
}
