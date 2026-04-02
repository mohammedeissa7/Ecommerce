import { Bone } from "./Bone";
import { ProductGridSkeleton } from "./ProductCardSkeleton";

export function FeaturedSectionSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section className="bg-stone-50 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <Bone className="h-2.5 w-16" />
            <Bone className="h-8 w-48" />
          </div>
        </div>
        <ProductGridSkeleton count={count} />
        {/* CTA button */}
        <div className="mt-12 flex justify-center">
          <Bone className="h-12 w-48" />
        </div>
      </div>
    </section>
  );
}
