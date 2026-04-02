import { Bone } from "./Bone";
export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Image */}
      <Bone className="aspect-[3/4] w-full" />
      {/* Category label */}
      <Bone className="h-2.5 w-16" />
      {/* Product name */}
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-3/4" />
      {/* Price */}
      <Bone className="h-3.5 w-20 mt-1" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}