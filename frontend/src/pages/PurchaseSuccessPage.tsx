import { useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Loader2,
  XCircle,
} from "lucide-react";
import { usePaymentStore } from "@/stores/usePaymentStore";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";

const FONT_SERIF = "'Cormorant Garamond', Georgia, serif";

export default function PurchaseSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const confirmed = useRef(false); // prevent double-call in StrictMode

  const {
    confirmCheckoutSuccess,
    order,
    isConfirming,
    error,
    clearPaymentState,
  } = usePaymentStore();
  const { clearCart } = useCartStore();

  useEffect(() => {
    // No session_id in URL → not a valid Stripe redirect
    if (!sessionId) {
      navigate("/");
      return;
    }
    if (confirmed.current) return;
    confirmed.current = true;

    const confirm = async () => {
      // POST /api/payment/checkout-success  →  { sessionId }
      // Controller: verifies payment_status==="paid", deactivates coupon, creates Order
      await confirmCheckoutSuccess(sessionId);
      // Clear the cart from client state after successful order
      await clearCart();
    };

    confirm();

    return () => {
      clearPaymentState();
    };
  }, [sessionId]);

  // Loading 
  if (isConfirming) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-['Jost',sans-serif] gap-5">
        <Loader2
          size={24}
          strokeWidth={1.5}
          className="animate-spin text-stone-300"
        />
        <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400">
          Confirming your order…
        </p>
      </div>
    );
  }

  //  Error 
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-['Jost',sans-serif] px-6 gap-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle size={28} strokeWidth={1} className="text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h1
            className="text-[24px] font-light text-stone-900"
            style={{ fontFamily: FONT_SERIF }}
          >
            Something went wrong
          </h1>
          <p className="text-stone-400 text-[12px] tracking-wide max-w-sm">
            {error}
          </p>
        </div>
        <Link
          to="/checkout"
          className="text-[11px] tracking-[0.2em] uppercase text-stone-900 underline underline-offset-4 hover:text-stone-500 transition-colors"
        >
          Return to Checkout
        </Link>
      </div>
    );
  }

  // Success 
  return (
    <main className="min-h-screen bg-white font-['Jost',sans-serif]">
      {/* Minimal top bar */}
      <div className="border-b border-stone-100 px-6 lg:px-10 h-16 flex items-center">
        <Link to="/">
          <span
            className="text-stone-900 text-lg tracking-[0.4em] uppercase font-semibold"
            style={{ fontFamily: FONT_SERIF }}
          >
            Eissa
          </span>
        </Link>
      </div>

      <div className="max-w-xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-10">
        {/* Icon */}
        <div className="relative">
          {/* Outer ring animation */}
          <div className="absolute inset-0 rounded-full border border-stone-200 animate-ping opacity-30" />
          <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center relative">
            <CheckCircle size={32} strokeWidth={1} className="text-stone-900" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400">
            Order Confirmed
          </p>
          <h1
            className="text-[34px] font-light text-stone-900 leading-tight"
            style={{ fontFamily: FONT_SERIF }}
          >
            Thank you for your purchase.
          </h1>
          <p className="text-stone-400 text-[13px] tracking-wide leading-relaxed max-w-sm">
            Your order has been placed and is being prepared. A confirmation
            email will be sent shortly.
          </p>
        </div>

        {/* Order details card */}
        {order?.orderId && (
          <div className="w-full border border-stone-100 px-6 py-5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <Package size={15} strokeWidth={1.5} className="text-stone-400" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400">
                Order Details
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-wide text-stone-400">
                  Order ID
                </span>
                <span className="text-[11px] tracking-[0.1em] text-stone-700 font-medium">
                  #{order.orderId.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-wide text-stone-400">
                  Status
                </span>
                <span className="text-[11px] tracking-wide text-emerald-500">
                  {order.message}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-stone-100" />

        {/* CTAs */}
        <div className="w-full space-y-3">
          <Button
            asChild
            className="w-full rounded-none bg-stone-900 hover:bg-stone-700 text-white h-12 text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 group"
          >
            <Link to="/">
              <span className="flex items-center gap-3">
                Continue Shopping
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Button>

          <Link
            to="/account/orders"
            className="block text-center text-[11px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors py-2"
          >
            View My Orders
          </Link>
        </div>

        {/* Brand watermark */}
        <p
          className="text-[clamp(40px,8vw,80px)] font-semibold tracking-[0.15em] uppercase text-stone-50 leading-none select-none pointer-events-none mt-4"
          style={{ fontFamily: FONT_SERIF }}
          aria-hidden="true"
        >
          Eissa
        </p>
      </div>
    </main>
  );
}
