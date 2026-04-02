import { Bone } from "./Bone";

export function HeroSkeleton() {
  return (
    <div className="relative h-[92vh] min-h-[600px] bg-stone-200 flex items-end overflow-hidden">
      <Bone className="absolute inset-0 rounded-none" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-16 lg:pb-20 space-y-5">
        <Bone className="h-2.5 w-36" />
        <div className="space-y-3">
          <Bone className="h-16 lg:h-24 w-64 lg:w-96" />
          <Bone className="h-16 lg:h-24 w-48 lg:w-72" />
        </div>
        <div className="space-y-2 pt-2">
          <Bone className="h-3 w-72" />
          <Bone className="h-3 w-60" />
        </div>
        <div className="flex items-center gap-4 pt-2">
          <Bone className="h-12 w-44" />
          <Bone className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}
