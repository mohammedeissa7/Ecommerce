import { cn } from "@/lib/utils";

export function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-stone-100 relative overflow-hidden rounded-none",
        "after:absolute after:inset-0 after:content-['']",
        "after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        "after:animate-[shimmer_1.6s_ease-in-out_infinite]",
        className,
      )}
    />
  );
}

export const shimmerKeyframe = `
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = shimmerKeyframe;
  document.head.appendChild(style);
}