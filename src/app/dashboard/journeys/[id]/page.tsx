import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Flag, Pencil, Plus } from "lucide-react";

import { DeleteJourneyButton } from "@/components/journey/delete-journey-button";
import { TrailDecoration } from "@/components/journey/trail-decoration";
import { TopicCard } from "@/components/trail/topic-card";
import { TopicForm } from "@/components/trail/topic-form";
import { TrailLine } from "@/components/trail/trail-line";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getJourneyForUser, requireAuthenticatedUser } from "@/lib/journey/queries";
import { formatJourneyDate } from "@/lib/journey/utils";
import { cn } from "@/lib/utils";

type JourneyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JourneyDetailPage({ params }: JourneyDetailPageProps) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;

  if (!user) {
    return null;
  }

  const journey = await getJourneyForUser(id, user.id);

  if (!journey) {
    notFound();
  }

  const attempt = journey.activeAttempt;

  return (
    <main
      id="main-content"
      className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--contour-sage)_0%,transparent_55%)] opacity-20" />

      <div className="relative space-y-8">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit gap-2"
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to trails
        </Link>

        <div className="space-y-5">
          <TrailDecoration variant="hero" className="max-w-sm" />

          <div className="flex flex-wrap items-center gap-3">
            {journey.category ? (
              <Badge variant="trail">{journey.category}</Badge>
            ) : null}
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Created {formatJourneyDate(journey.createdAt)}
            </p>
          </div>

          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {journey.title}
          </h1>

          {journey.description ? (
            <p className="text-lg leading-relaxed text-muted-foreground">
              {journey.description}
            </p>
          ) : (
            <p className="text-lg italic leading-relaxed text-muted-foreground">
              No description yet — add one when you edit this trail.
            </p>
          )}
        </div>

        {attempt ? (
          <section
            aria-labelledby="attempt-heading"
            className="rounded-2xl border border-border/70 bg-card/95 p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-trail-blaze/30 bg-trail-blaze/10">
                <Flag className="size-5 text-trail-blaze" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2
                  id="attempt-heading"
                  className="font-heading text-lg font-semibold text-foreground"
                >
                  Current Attempt
                </h2>
                <p className="font-mono text-sm text-muted-foreground">
                  Attempt #{attempt.attemptNumber} · {attempt.status} · Started{" "}
                  {formatJourneyDate(attempt.startDate)}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="trail-heading" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wider text-trail-blaze">
                Trail Structure
              </p>
              <h2
                id="trail-heading"
                className="font-heading text-2xl font-bold tracking-tight text-foreground"
              >
                {journey.title}
              </h2>
            </div>

            {journey.topics.length > 0 ? (
              <details className="rounded-xl border border-contour-sage/30 bg-contour-sage/10 p-4">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-foreground marker:hidden">
                  <Plus className="size-4 text-trail-blaze" aria-hidden="true" />
                  Add Topic
                </summary>
                <div className="mt-4 w-full sm:w-96">
                  <TopicForm
                    mode="create"
                    journeyId={journey.id}
                    submitLabel="Add Topic"
                  />
                </div>
              </details>
            ) : null}
          </div>

          {journey.topics.length > 0 ? (
            <div className="relative space-y-8">
              <TrailLine />
              {journey.topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/80 bg-card/80 p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--contour-sage)_0%,transparent_62%)] opacity-15" />
              <div className="relative space-y-5">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                    Your trail has no segments yet.
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Create your first topic to map the path ahead.
                  </p>
                </div>

                <TopicForm
                  mode="create"
                  journeyId={journey.id}
                  submitLabel="Add First Topic"
                />
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/dashboard/journeys/${journey.id}/edit`}
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <Pencil aria-hidden="true" />
            Edit Journey
          </Link>

          <DeleteJourneyButton
            journeyId={journey.id}
            journeyTitle={journey.title}
          />
        </div>
      </div>
    </main>
  );
}
