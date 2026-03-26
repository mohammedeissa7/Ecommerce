import axios from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  signUp: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      toast.success("Signup successful! Welcome, " + data.user.name);
    } catch (err: any) {
      const message =
        err.response?.data?.message ?? "Signup failed. Please try again.";
      set({ error: message, isLoading: false });
      toast.error(message);

      throw new Error(message);
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      toast.success("Login successful! Welcome back, " + data.user.name);
    } catch (err: any) {
      const message =
        err.response?.data?.message ?? "Login failed. Please try again.";
      set({ error: message, isLoading: false });
      toast.error(message);
      throw new Error(message);
    }
  },

  signOut: async () => {
    try {
      await axios.post("/auth/logout");
      toast.success("Logout successful. See you next time!");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      set({ user: null, isAuthenticated: false, error: null });

    }
  },

  clearError: () => set({ error: null }),
}));
