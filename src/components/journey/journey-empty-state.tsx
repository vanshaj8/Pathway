import Link from "next/link";
import { Mountain, Plus } from "lucide-react";

import { TrailDecoration } from "@/components/journey/trail-decoration";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function JourneyEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 px-6 py-14 text-center sm:px-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--contour-sage)_0%,transparent_65%)] opacity-15" />

      <div className="relative mx-auto flex max-w-md flex-col items-center gap-6">
        <div className="flex size-14 items-center justify-center rounded-full border border-contour-sage/30 bg-contour-sage/10">
          <Mountain className="size-7 text-trail-blaze" aria-hidden="true" />
        </div>

        <div className="w-full max-w-xs">
          <TrailDecoration variant="hero" />
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Start your first trail
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Every mastery begins with a single step. Create your first journey
            and start your climb.
          </p>
        </div>

        <Link
          href="/dashboard/journeys/new"
          className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
        >
          <Plus aria-hidden="true" />
          Create Your First Journey
        </Link>
      </div>
    </div>
  );
}
