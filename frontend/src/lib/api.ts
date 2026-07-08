import axios from "axios";

/**
 * withCredentials:true is required so the httpOnly JWT cookie set by the
 * backend is sent on every request. In dev, Vite proxies /api to
 * localhost:5000 (see vite.config.ts), so baseURL is just "/api" — no
 * env var needed until production, where it should point at the Render URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Centralized 401 handling: bounce to login if the session has expired,
// but only once (avoid redirect loops if the login page itself 401s).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
