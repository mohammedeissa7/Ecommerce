import { Bone } from "./Bone";

export function CheckoutSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
        {/* Left */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Bone className="h-2.5 w-24" />
            <Bone className="h-8 w-40" />
          </div>

          {/* Items card */}
          <div className="border border-stone-100">
            <div className="px-6 py-4 border-b border-stone-50 flex justify-between">
              <Bone className="h-2.5 w-16" />
              <Bone className="h-2.5 w-12" />
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex gap-4 px-6 py-4 border-b border-stone-50 last:border-0"
              >
                <Bone className="w-16 h-20 flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="space-y-2">
                    <Bone className="h-2.5 w-16" />
                    <Bone className="h-4 w-3/4" />
                  </div>
                  <Bone className="h-2.5 w-16" />
                </div>
                <Bone className="h-4 w-16 flex-shrink-0 self-start" />
              </div>
            ))}
          </div>

          {/* Coupon card */}
          <div className="border border-stone-100 px-6 py-5 space-y-4">
            <Bone className="h-2.5 w-28" />
            <div className="flex gap-0">
              <Bone className="h-10 flex-1" />
              <Bone className="h-10 w-16" />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="border border-stone-100">
          <div className="px-6 py-6 space-y-4 border-b border-stone-50">
            <Bone className="h-2.5 w-20" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <Bone className="h-3 w-24" />
                <Bone className="h-3 w-16" />
              </div>
            ))}
          </div>
          <div className="px-6 py-5 flex justify-between border-b border-stone-50">
            <Bone className="h-4 w-16" />
            <Bone className="h-6 w-24" />
          </div>
          <div className="px-6 py-6 space-y-3">
            <Bone className="h-12 w-full" />
            <Bone className="h-3 w-3/4 mx-auto" />
            <Bone className="h-3 w-2/3 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
