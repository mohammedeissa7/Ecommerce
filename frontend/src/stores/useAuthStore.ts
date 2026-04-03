import { create } from "zustand";
import toast from "react-hot-toast";
import  axiosInstance  from '@/lib/axios';

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
  checkingAuth: boolean;

  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  checkingAuth: true,

  signUp: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/auth/signup", {
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
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      toast.success("Login successful! Welcome back, " + data.user.name);
    } catch (err: any) {
      const message =
        err.response?.data?.message ?? "Login failed. Please try again.";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  signOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null, isAuthenticated: false, error: null });
      toast.success("Logout successful. See you next time!");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      set({ user: null, isAuthenticated: false, error: null });
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));


let refreshPromise : Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useAuthStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useAuthStore.getState().signOut();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);