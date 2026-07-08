import { create } from "zustand";
import api from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User) => void;
}

/**
 * Auth state lives in Zustand (not React context) so any component can read
 * `user` without a provider wrapper, and so non-component code (like the
 * axios interceptor) could reach in if ever needed. The JWT itself never
 * touches this store — it's an httpOnly cookie the browser manages.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      set({ user: data.user, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      set({ user: data.user, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null });
  },

  // Called once on app load to check for an existing valid cookie session.
  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, isLoading: false, isInitialized: true });
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  // Used after a profile edit (Settings) so the sidebar reflects the new
  // name/email immediately, without a full session round trip.
  setUser: (user) => set({ user }),
}));
