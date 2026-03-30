import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Pagination } from "@/stores/useProductStore";

interface PaginationProps {
  pagination: Pagination;
  scrollTop?: boolean;
}

export default function PaginationBar({
  pagination,
  scrollTop = true,
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    totalCount,
    limit,
  } = pagination;

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
    if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const buildPages = (): (number | "…")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "…")[] = [1];
    const left = currentPage - 1;
    const right = currentPage + 1;

    if (left > 2) pages.push("…");
    for (let p = Math.max(2, left); p <= Math.min(totalPages - 1, right); p++) {
      pages.push(p);
    }
    if (right < totalPages - 1) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  const pages = buildPages();
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  return (
    <div className="flex flex-col items-center gap-5 py-10 font-['Jost',sans-serif]">
      {/* Result count */}
      <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400">
        Showing {startItem}–{endItem} of {totalCount} items
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <Button
          variant="ghost"
          size="icon"
          disabled={!hasPrevPage}
          onClick={() => goTo(currentPage - 1)}
          className={cn(
            "w-9 h-9 rounded-none text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors",
            !hasPrevPage && "opacity-30 cursor-not-allowed",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} strokeWidth={1.5} />
        </Button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-[12px] text-stone-300 select-none"
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goTo(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              className={cn(
                "w-9 h-9 text-[11px] tracking-[0.1em] transition-all duration-200 relative",
                p === currentPage
                  ? "text-stone-900 font-medium after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-px after:bg-stone-900"
                  : "text-stone-400 hover:text-stone-900",
              )}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <Button
          variant="ghost"
          size="icon"
          disabled={!hasNextPage}
          onClick={() => goTo(currentPage + 1)}
          className={cn(
            "w-9 h-9 rounded-none text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors",
            !hasNextPage && "opacity-30 cursor-not-allowed",
          )}
          aria-label="Next page"
        >
          <ChevronRight size={15} strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}
