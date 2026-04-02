import { useEffect, useRef } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartDrawerSkeleton } from "./skeletons/CartDrawerSkeleton";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    isLoading,
    closeDrawer,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();

  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleCheckout = () => {
    closeDrawer();
    navigate("/checkout");
  };

  return (
    <>
      {/*Backdrop*/}
      <div
        ref={overlayRef}
        onClick={closeDrawer}
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-400",
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        aria-hidden="true"
      />

      {/* Drawer  */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white flex flex-col",
          "shadow-[-8px_0_40px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "font-['Jost',sans-serif]",
          isDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/*  Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <ShoppingBag
              size={17}
              strokeWidth={1.5}
              className="text-stone-500"
            />
            <h2 className="text-[11px] tracking-[0.25em] uppercase text-stone-900 font-medium">
              Your Bag
            </h2>
            {totalItems() > 0 && (
              <span className="text-[10px] tracking-wide text-stone-400">
                ({totalItems()} {totalItems() === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-50"
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items  */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
          {isLoading && items.length === 0 ? (
            <CartDrawerSkeleton />
          ) : items.length === 0 ? (
            // Empty cart
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
              <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center">
                <ShoppingBag
                  size={24}
                  strokeWidth={1}
                  className="text-stone-300"
                />
              </div>
              <div className="text-center space-y-1">
                <p
                  className="text-stone-500 text-lg font-light"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Your bag is empty
                </p>
                <p className="text-stone-300 text-[11px] tracking-[0.15em] uppercase">
                  Add something beautiful
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="mt-2 text-[11px] tracking-[0.2em] uppercase text-stone-900 underline underline-offset-4 hover:text-stone-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Cart items list
            <ul className="divide-y divide-stone-50">
              {items.map((item) => (
                <li key={item._id} className="py-5 flex gap-4">
                  {/* Product image */}
                  <Link
                    to={`/products/${item._id}`}
                    onClick={closeDrawer}
                    className="flex-shrink-0 w-20 h-24 bg-stone-100 overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] tracking-[0.25em] uppercase text-stone-400 mb-0.5">
                          {item.category}
                        </p>
                        <h3
                          className="text-[15px] font-light text-stone-900 leading-snug truncate"
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                          }}
                        >
                          {item.name}
                        </h3>
                        <p className="text-[12px] text-stone-500 mt-0.5">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        aria-label={`Remove ${item.name}`}
                        className="flex-shrink-0 text-stone-300 hover:text-red-400 transition-colors p-0.5"
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Quantity + line total */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-stone-200">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                        >
                          <Minus size={11} strokeWidth={2} />
                        </button>
                        <span className="w-8 text-center text-[12px] tracking-wide text-stone-700 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                        >
                          <Plus size={11} strokeWidth={2} />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="text-[13px] tracking-wide text-stone-900 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only when cart has items */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-6 space-y-5 bg-white">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-[0.2em] uppercase text-stone-400">
                  Subtotal
                </span>
                <span className="text-[15px] tracking-wide text-stone-900">
                  ${totalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-[0.2em] uppercase text-stone-400">
                  Shipping
                </span>
                <span className="text-[11px] tracking-wide text-stone-400">
                  {totalPrice() >= 250 ? "Free" : "Calculated at checkout"}
                </span>
              </div>
              {totalPrice() < 250 && (
                <p className="text-[10px] tracking-wide text-stone-300 text-right">
                  Add ${(250 - totalPrice()).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            {/* Free shipping progress bar */}
            <div className="h-px w-full bg-stone-100 overflow-hidden">
              <div
                className="h-full bg-stone-900 transition-all duration-700"
                style={{
                  width: `${Math.min((totalPrice() / 250) * 100, 100)}%`,
                }}
              />
            </div>

            {/* Checkout CTA */}
            <Button
              onClick={handleCheckout}
              className="w-full rounded-none bg-stone-900 hover:bg-stone-700 text-white h-12 text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 group"
            >
              <span className="flex items-center gap-3">
                Proceed to Checkout
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </Button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full text-[10px] tracking-[0.2em] uppercase text-stone-300 hover:text-red-400 transition-colors text-center"
            >
              Clear bag
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
