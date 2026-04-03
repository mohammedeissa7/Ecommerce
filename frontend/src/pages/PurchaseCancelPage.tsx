import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";

const FONT_SERIF = "'Cormorant Garamond', Georgia, serif";

export default function PurchaseCancelPage() {
  const { openDrawer } = useCartStore();

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

      <div className="max-w-xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-10">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center">
          <ShoppingBag size={28} strokeWidth={1} className="text-stone-400" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400">
            Payment Cancelled
          </p>
          <h1
            className="text-[34px] font-light text-stone-900 leading-tight"
            style={{ fontFamily: FONT_SERIF }}
          >
            Your order was not placed.
          </h1>
          <p className="text-stone-400 text-[13px] tracking-wide leading-relaxed max-w-sm">
            No charge has been made. Your bag is still saved — pick up right
            where you left off.
          </p>
        </div>

        <div className="w-full h-px bg-stone-100" />

        {/* CTAs */}
        <div className="w-full space-y-3">
          <Button
            onClick={openDrawer}
            className="w-full rounded-none bg-stone-900 hover:bg-stone-700 text-white h-12 text-[11px] tracking-[0.3em] uppercase transition-colors duration-300"
          >
            <span className="flex items-center gap-3">
              <ShoppingBag size={14} strokeWidth={1.5} />
              Return to Bag
            </span>
          </Button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors py-2"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Continue Shopping
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
