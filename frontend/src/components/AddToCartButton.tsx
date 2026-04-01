import { useState } from "react";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  variant?: "default" | "icon";
  className?: string;
}

export default function AddToCartButton({
  productId,
  variant = "default",
  className,
}: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    await addToCart(productId);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // reset after 2s
  };

  // Icon-only variant (overlay on product card)
  if (variant === "icon") {
    return (
      <button
        onClick={handleAdd}
        disabled={isLoading}
        aria-label="Add to bag"
        className={cn(
          "w-9 h-9 flex items-center justify-center bg-white text-stone-700 hover:bg-stone-900 hover:text-white transition-all duration-200 shadow-sm",
          isLoading && "opacity-60 cursor-not-allowed",
          className,
        )}
      >
        {isLoading ? (
          <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
        ) : added ? (
          <Check size={14} strokeWidth={2} className="text-emerald-500" />
        ) : (
          <ShoppingBag size={14} strokeWidth={1.5} />
        )}
      </button>
    );
  }

  //  Default full-width variant (product detail page) 
  return (
    <Button
      onClick={handleAdd}
      disabled={isLoading}
      className={cn(
        "w-full rounded-none h-12 text-[11px] tracking-[0.3em] uppercase transition-all duration-300 group",
        added
          ? "bg-emerald-600 hover:bg-emerald-600 text-white"
          : "bg-stone-900 hover:bg-stone-700 text-white",
        isLoading && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {isLoading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : added ? (
        <span className="flex items-center gap-2">
          <Check size={14} strokeWidth={2} />
          Added to Bag
        </span>
      ) : (
        <span className="flex items-center gap-3">
          <ShoppingBag size={14} strokeWidth={1.5} />
          Add to Bag
        </span>
      )}
    </Button>
  );
}
