import { create } from "zustand";
import axiosInstance from "@/lib/axios";


interface CheckoutPayload {
  products: {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  couponCode?: string;
}

interface CheckoutSession {
  id: string; 
  totalAmount: number; 
}

interface OrderResult {
  success: boolean;
  message: string;
  orderId: string;
}

interface PaymentState {
  session: CheckoutSession | null;
  order: OrderResult | null;
  couponCode: string;
  couponError: string | null;
  isProcessing: boolean;
  isConfirming: boolean;
  error: string | null;


  createCheckoutSession: (payload: CheckoutPayload) => Promise<string | null>;


  confirmCheckoutSuccess: (sessionId: string) => Promise<void>;

  setCouponCode: (code: string) => void;
  clearPaymentState: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  session: null,
  order: null,
  couponCode: "",
  couponError: null,
  isProcessing: false,
  isConfirming: false,
  error: null,

  createCheckoutSession: async (payload) => {
    set({ isProcessing: true, error: null, couponError: null });
    try {
      const { data } = await axiosInstance.post<CheckoutSession>(
        "/payment/create-checkout-session",
        payload,
      );
      set({ session: data, isProcessing: false });
      return data.id;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? "Failed to create checkout session.";
      if (msg.toLowerCase().includes("coupon")) {
        set({ couponError: msg, isProcessing: false });
      } else {
        set({ error: msg, isProcessing: false });
      }
      return null;
    }
  },

  confirmCheckoutSuccess: async (sessionId) => {
    set({ isConfirming: true, error: null });
    try {
      const { data } = await axiosInstance.post<OrderResult>(
        "/payment/checkout-success",
        { sessionId },
      );
      set({ order: data, isConfirming: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Failed to confirm payment.",
        isConfirming: false,
      });
    }
  },

  setCouponCode: (code) => set({ couponCode: code, couponError: null }),
  clearPaymentState: () =>
    set({
      session: null,
      order: null,
      couponCode: "",
      error: null,
      couponError: null,
    }),
}));
