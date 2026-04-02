import { Bone } from "./Bone";
import { CategoryGridSkeleton } from "./CategoryGridSkeleton";
import { EditorialSkeleton } from "./EditorialSkeleton";
import { FeaturedSectionSkeleton } from "./FeaturedSectionSkeleton";
import { HeroSkeleton } from "./HeroSkeleton";

export function HomePageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <Bone className="w-full h-10 bg-stone-900 rounded-none" />
      <CategoryGridSkeleton />
      <FeaturedSectionSkeleton count={8} />
      <EditorialSkeleton />
    </>
  );
}
