import { Bone } from "./Bone";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function ProductDetailSkeleton() {
  return (
    <main className="font-['Jost',sans-serif]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-2 flex items-center gap-2">
        <Bone className="h-2.5 w-10" />
        <span className="text-stone-200">/</span>
        <Bone className="h-2.5 w-20" />
        <span className="text-stone-200">/</span>
        <Bone className="h-2.5 w-24" />
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Image column */}
          <div className="flex gap-4">
            {/* Thumbnail strip */}
            <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
              {[0, 1, 2].map((i) => (
                <Bone key={i} className="w-16 h-20" />
              ))}
            </div>
            {/* Main image */}
            <Bone className="flex-1 aspect-[3/4]" />
          </div>

          {/* Info column */}
          <div className="lg:pt-4 space-y-8">
            {/* Brand label + title */}
            <div className="space-y-3">
              <Bone className="h-2.5 w-24" />
              <Bone className="h-10 w-4/5" />
              <Bone className="h-8 w-3/5" />
              <Bone className="h-7 w-28 mt-2" />
            </div>

            <Bone className="h-px w-full" />

            {/* Description */}
            <div className="space-y-2">
              <Bone className="h-3.5 w-full" />
              <Bone className="h-3.5 w-full" />
              <Bone className="h-3.5 w-4/5" />
              <Bone className="h-3.5 w-2/3" />
            </div>

            {/* CTA button */}
            <Bone className="h-12 w-full" />

            {/* Trust strips */}
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Bone className="w-6 h-6 rounded-full" />
                  <Bone className="h-2.5 w-16" />
                  <Bone className="h-2 w-20" />
                </div>
              ))}
            </div>

            <Bone className="h-px w-full" />

            {/* Accordion rows */}
            <div className="space-y-0">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="border-t border-stone-100 py-4 flex justify-between items-center"
                >
                  <Bone className="h-2.5 w-32" />
                  <Bone className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-stone-100">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <Bone className="h-2.5 w-24" />
            <Bone className="h-7 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
