import { Bone } from "./Bone";

export function CartDrawerSkeleton() {
  return (
    <div className="flex-1 px-6 py-4 space-y-0 overflow-y-auto">
      <ul className="divide-y divide-stone-50">
        {[0, 1, 2].map((i) => (
          <li key={i} className="py-5 flex gap-4">
            {/* Product image */}
            <Bone className="w-20 h-24 flex-shrink-0" />
            {/* Info */}
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div className="space-y-2">
                <Bone className="h-2.5 w-16" />
                <Bone className="h-4 w-3/4" />
                <Bone className="h-3.5 w-20" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <Bone className="h-7 w-24" />
                <Bone className="h-4 w-16" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
