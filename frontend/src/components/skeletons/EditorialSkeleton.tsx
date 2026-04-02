import { cn } from "@/lib/utils";
import { Bone } from "./Bone";

export function EditorialSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 space-y-24">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={cn(
            "grid lg:grid-cols-2 gap-10 lg:gap-20 items-center",
            i % 2 === 1 && "lg:[direction:rtl]",
          )}
        >
          <Bone
            className={cn(
              "aspect-[4/5] w-full",
              i % 2 === 1 && "[direction:ltr]",
            )}
          />
          <div className={cn("space-y-5", i % 2 === 1 && "[direction:ltr]")}>
            <Bone className="h-2.5 w-20" />
            <div className="space-y-2">
              <Bone className="h-10 w-4/5" />
              <Bone className="h-10 w-3/5" />
            </div>
            <div className="space-y-2 pt-2">
              <Bone className="h-3.5 w-full" />
              <Bone className="h-3.5 w-full" />
              <Bone className="h-3.5 w-2/3" />
            </div>
            <Bone className="h-4 w-24 mt-4" />
          </div>
        </div>
      ))}
    </section>
  );
}
