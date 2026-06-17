import Link from "next/link";
import { Flag } from "lucide-react";

import { TrailDecoration } from "@/components/journey/trail-decoration";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JourneyListItem } from "@/lib/journey/queries";
import { formatJourneyDate } from "@/lib/journey/utils";

type JourneyCardProps = {
  journey: JourneyListItem;
};

export function JourneyCard({ journey }: JourneyCardProps) {
  const attemptLabel = journey.activeAttempt
    ? `Attempt #${journey.activeAttempt.attemptNumber} · ${journey.activeAttempt.status}`
    : "No active attempt";

  return (
    <Link
      href={`/dashboard/journeys/${journey.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full overflow-hidden border-border/70 bg-card/95 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-trail-blaze/30 group-hover:shadow-md">
        <div className="px-4 pt-3">
          <TrailDecoration />
        </div>

        <CardHeader className="gap-2 pt-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="font-heading text-lg font-semibold leading-snug tracking-tight text-foreground">
              {journey.title}
            </CardTitle>
            {journey.category ? (
              <Badge variant="trail" className="shrink-0">
                {journey.category}
              </Badge>
            ) : null}
          </div>

          {journey.description ? (
            <CardDescription className="line-clamp-2 text-sm leading-relaxed">
              {journey.description}
            </CardDescription>
          ) : (
            <CardDescription className="italic">
              No description yet — the trail awaits your story.
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {formatJourneyDate(journey.createdAt)}
          </p>

          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-trail-blaze">
            <Flag className="size-3.5" aria-hidden="true" />
            {attemptLabel}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
