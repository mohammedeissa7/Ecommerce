import { create } from "zustand";
import axiosInstance from "@/lib/axios";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured?: boolean;
}

export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  recommendedProducts: Product[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;


  fetchAllProducts: (page: number, limit?: number) => Promise<void>;
  fetchProductsByCategory: (
    category: string,
    page: number,
    limit?: number,
  ) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchRecommendedProducts: () => Promise<void>;

  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  featuredProducts: [],
  recommendedProducts: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchAllProducts: async (page = 1, limit = 12) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/products", { params: { page, limit } });
      set({
        products: data.products,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to fetch products.",
        isLoading: false,
      });
    }
  },


  fetchProductsByCategory: async (category, page = 1, limit = 12) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/products/category/${category}`, {
        params: { page, limit },
      });
      set({
        products: data.products,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to fetch products.",
        isLoading: false,
      });
    }
  },


  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/products/featured");
      set({ featuredProducts: data, isLoading: false });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ?? "Failed to fetch featured products.",
        isLoading: false,
      });
    }
  },

  fetchRecommendedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/products/recommended");
      set({ recommendedProducts: data, isLoading: false });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ?? "Failed to fetch recommendations.",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
