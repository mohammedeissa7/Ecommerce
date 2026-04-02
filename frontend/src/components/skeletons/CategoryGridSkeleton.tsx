import { Bone } from "./Bone";

export function CategoryGridSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
      {/* Section heading */}
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <Bone className="h-2.5 w-16" />
          <Bone className="h-8 w-52" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="aspect-[3/4] w-full" />
        ))}
      </div>
    </section>
  );
}
