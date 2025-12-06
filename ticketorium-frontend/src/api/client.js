// /Users/reema/Desktop/Ticketorium/ticketorium-frontend/src/api/client.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ticketorium.vercel.app/";

export function getApiBaseUrl() {
    return API_BASE_URL;
}
