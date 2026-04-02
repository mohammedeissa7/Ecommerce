import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Tag, X, Loader2, ShieldCheck, Lock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/stores/useCartStore";
import { usePaymentStore } from "@/stores/usePaymentStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const FONT_SERIF = "'Cormorant Garamond', Georgia, serif";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const {
    couponCode,
    couponError,
    isProcessing,
    error,
    setCouponCode,
    createCheckoutSession,
    clearPaymentState,
  } = usePaymentStore();

  const [couponInput, setCouponInput] = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) navigate("/signin");
  }, [isAuthenticated]);

  // Redirect empty cart
  useEffect(() => {
    if (isAuthenticated && items.length === 0) navigate("/");
  }, [items.length, isAuthenticated]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      clearPaymentState();
    },
    [],
  );

  const shipping = totalPrice() >= 250 ? 0 : 15;
  const subtotal = totalPrice();
  const grandTotal = subtotal + shipping;

  // Apply coupon
  const applyCoupon = () => {
    if (!couponInput.trim()) return;
    setCouponCode(couponInput.trim().toUpperCase());
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponInput("");
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    const payload = {
      products: items.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      ...(couponCode ? { couponCode } : {}),
    };

    const sessionId = await createCheckoutSession(payload);
    if (!sessionId) return;

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId,
    });
    if (stripeError) {
      console.error("Stripe redirect error:", stripeError.message);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 font-['Jost',sans-serif]">
      {/* Top bar  */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/">
            <span
              className="text-stone-900 text-lg tracking-[0.4em] uppercase font-semibold"
              style={{ fontFamily: FONT_SERIF }}
            >
              Eissa
            </span>
          </Link>
          <div className="flex items-center gap-2 text-stone-400 text-[11px] tracking-[0.15em] uppercase">
            <Lock size={11} strokeWidth={1.5} />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
          {/*  Left — Order summary */}
          <div className="space-y-8">
            {/* Heading */}
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                Review & Pay
              </p>
              <h1
                className="text-[28px] font-light text-stone-900"
                style={{ fontFamily: FONT_SERIF }}
              >
                Your Order
              </h1>
            </div>

            {/* Items */}
            <div className="bg-white border border-stone-100">
              <div className="px-6 py-4 border-b border-stone-50 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400">
                  {totalItems()} {totalItems() === 1 ? "Item" : "Items"}
                </span>
                <Link
                  to="/"
                  className="text-[10px] tracking-[0.15em] uppercase text-stone-400 hover:text-stone-900 transition-colors underline underline-offset-2"
                >
                  Edit bag
                </Link>
              </div>

              <ul className="divide-y divide-stone-50">
                {items.map((item) => (
                  <li key={item._id} className="flex gap-4 px-6 py-4">
                    {/* Image */}
                    <div className="w-16 h-20 bg-stone-100 flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                      <div>
                        <p className="text-[9px] tracking-[0.25em] uppercase text-stone-400">
                          {item.category}
                        </p>
                        <p
                          className="text-[15px] font-light text-stone-900 leading-snug truncate mt-0.5"
                          style={{ fontFamily: FONT_SERIF }}
                        >
                          {item.name}
                        </p>
                      </div>
                      <p className="text-[11px] tracking-wide text-stone-400">
                        Qty {item.quantity}
                      </p>
                    </div>
                    {/* Line price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[14px] tracking-wide text-stone-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-stone-300 mt-0.5">
                          ${item.price.toFixed(2)} each
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coupon */}
            <div className="bg-white border border-stone-100 px-6 py-5">
              <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-4">
                Coupon Code
              </p>

              {couponCode ? (
                // Applied coupon pill
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag
                      size={13}
                      strokeWidth={1.5}
                      className="text-emerald-500"
                    />
                    <span className="text-[12px] tracking-[0.15em] text-emerald-600 font-medium">
                      {couponCode}
                    </span>
                    <span className="text-[10px] text-stone-300 tracking-wide">
                      applied
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-300 hover:text-red-400 transition-colors"
                    aria-label="Remove coupon"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                // Input row
                <div className="flex gap-0">
                  <Input
                    type="text"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Enter code"
                    className={cn(
                      "rounded-none border-0 border-b bg-transparent px-0 h-10 text-stone-900 text-sm tracking-[0.15em] placeholder:text-stone-300 focus-visible:ring-0 transition-colors duration-200 flex-1",
                      couponError
                        ? "border-red-400"
                        : "border-stone-200 focus-visible:border-stone-900",
                    )}
                  />
                  <button
                    onClick={applyCoupon}
                    className="h-10 px-4 border-b border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 hover:border-stone-900 transition-all duration-200"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-red-400 text-[11px] tracking-wide mt-2">
                  {couponError}
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: ShieldCheck, label: "SSL Encrypted" },
                { icon: Lock, label: "Secure Payment" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-stone-300"
                >
                  <Icon size={14} strokeWidth={1.5} />
                  <span className="text-[10px] tracking-[0.15em] uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/*  Right — Price summary + CTA */}
          <div className="lg:sticky lg:top-24 space-y-0">
            <div className="bg-white border border-stone-100">
              {/* Price breakdown */}
              <div className="px-6 py-6 space-y-4 border-b border-stone-50">
                <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400">
                  Summary
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] tracking-wide text-stone-500">
                      Subtotal
                    </span>
                    <span className="text-[13px] tracking-wide text-stone-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {couponCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] tracking-wide text-emerald-500">
                        Coupon ({couponCode})
                      </span>
                      <span className="text-[12px] tracking-wide text-emerald-500">
                        Applied at Stripe
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-[12px] tracking-wide text-stone-500">
                      Shipping
                    </span>
                    <span
                      className={cn(
                        "text-[12px] tracking-wide",
                        shipping === 0 ? "text-emerald-500" : "text-stone-900",
                      )}
                    >
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-[10px] text-stone-300 tracking-wide">
                      Free shipping on orders over $250
                    </p>
                  )}
                </div>
              </div>

              {/* Grand total */}
              <div className="px-6 py-5 flex justify-between items-center border-b border-stone-50">
                <span className="text-[11px] tracking-[0.2em] uppercase text-stone-500">
                  Total
                </span>
                <span
                  className="text-[20px] font-light tracking-wide text-stone-900"
                  style={{ fontFamily: FONT_SERIF }}
                >
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              {/* CTA */}
              <div className="px-6 py-6 space-y-4">
                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-red-500 text-[11px] tracking-wide">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                  className="w-full rounded-none bg-stone-900 hover:bg-stone-700 text-white h-13 text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 group disabled:opacity-40 py-4"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Redirecting to Stripe…
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      Pay with Stripe
                      <ArrowRight
                        size={14}
                        strokeWidth={1.5}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  )}
                </Button>

                <p className="text-center text-[10px] tracking-wide text-stone-300 leading-relaxed">
                  You'll be redirected to Stripe's secure payment page.
                  <br />
                  We never store your card details.
                </p>
              </div>
            </div>

            {/* Accepted cards */}
            <div className="px-6 py-4 flex items-center justify-center gap-3">
              {["VISA", "MC", "AMEX", "PAYPAL"].map((brand) => (
                <span
                  key={brand}
                  className="text-[9px] tracking-[0.15em] text-stone-300 border border-stone-100 px-2 py-1"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
