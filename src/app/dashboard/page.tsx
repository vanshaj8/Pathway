import Link from "next/link";
import { Plus } from "lucide-react";

import { JourneyCard } from "@/components/journey/journey-card";
import { JourneyEmptyState } from "@/components/journey/journey-empty-state";
import { buttonVariants } from "@/components/ui/button";
import { getJourneysForUser, requireAuthenticatedUser } from "@/lib/journey/queries";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();

  if (!user) {
    return null;
  }

  const journeys = await getJourneysForUser(user.id);
  const displayName = user.name ?? user.email;

  return (
    <main
      id="main-content"
      className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--contour-sage)_0%,transparent_55%)] opacity-20" />

      <div className="relative space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-sm uppercase tracking-widest text-contour-sage">
              Base camp · {displayName}
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your Trails
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Every journey is a path toward mastery.
            </p>
          </div>

          {journeys.length > 0 ? (
            <Link
              href="/dashboard/journeys/new"
              className={cn(buttonVariants({ size: "lg" }), "h-11 shrink-0 px-6")}
            >
              <Plus aria-hidden="true" />
              Create New Journey
            </Link>
          ) : null}
        </div>

        {journeys.length === 0 ? (
          <JourneyEmptyState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
