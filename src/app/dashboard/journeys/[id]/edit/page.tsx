import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { JourneyForm } from "@/components/journey/journey-form";
import { TrailDecoration } from "@/components/journey/trail-decoration";
import { buttonVariants } from "@/components/ui/button";
import { getJourneyForUser, requireAuthenticatedUser } from "@/lib/journey/queries";
import { cn } from "@/lib/utils";

type EditJourneyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditJourneyPage({ params }: EditJourneyPageProps) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;

  if (!user) {
    return null;
  }

  const journey = await getJourneyForUser(id, user.id);

  if (!journey) {
    notFound();
  }

  return (
    <main
      id="main-content"
      className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--switchback-gold)_0%,transparent_50%)] opacity-15" />

      <div className="relative space-y-8">
        <Link
          href={`/dashboard/journeys/${journey.id}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit gap-2"
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to journey
        </Link>

        <div className="space-y-4">
          <div className="max-w-xs">
            <TrailDecoration variant="hero" />
          </div>
          <p className="font-mono text-sm uppercase tracking-widest text-contour-sage">
            Edit trail
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {journey.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Update your journey details. Attempt history is preserved.
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/95 p-6 sm:p-8">
          <JourneyForm
            mode="edit"
            journeyId={journey.id}
            defaultValues={{
              title: journey.title,
              category: journey.category,
              description: journey.description,
            }}
          />
        </div>
      </div>
    </main>
  );
}
