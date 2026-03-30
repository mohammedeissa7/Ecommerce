import { create } from "zustand";
import axiosInstance from "@/lib/axios";

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isDrawerOpen: boolean;
  error: string | null;

  
  fetchCart: () => Promise<void>;                          
  addToCart: (productId: string) => Promise<void>;        
  removeFromCart: (productId: string) => Promise<void>;   
  clearCart: () => Promise<void>;                         
  updateQuantity: (productId: string, quantity: number) => Promise<void>; 

 
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  isDrawerOpen: false,
  error: null,

  
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/cart");
      set({ items: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? "Failed to fetch cart.", isLoading: false });
    }
  },


  addToCart: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/cart", { productId });
      await get().fetchCart(); // sync full product details
      set({ isDrawerOpen: true, isLoading: false }); // open drawer on add
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? "Failed to add item.", isLoading: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete("/cart", { data: { productId } });
      set((state) => ({
        items: state.items.filter((item) => item._id !== productId),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? "Failed to remove item.", isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete("/cart", { data: {} });
      set({ items: [], isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? "Failed to clear cart.", isLoading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/cart/${productId}`, { quantity });
      if (quantity === 0) {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
          isLoading: false,
        }));
      } else {
        set((state) => ({
          items: state.items.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
          isLoading: false,
        }));
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? "Failed to update quantity.", isLoading: false });
    }
  },


  openDrawer : () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
