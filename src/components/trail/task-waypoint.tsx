import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";

import { DeleteTaskButton } from "@/components/trail/delete-buttons";
import { TaskForm } from "@/components/trail/task-form";
import { buttonVariants } from "@/components/ui/button";
import type { TrailTask } from "@/lib/journey/queries";
import { cn } from "@/lib/utils";

type TaskWaypointProps = {
  task: TrailTask;
};

export function TaskWaypoint({ task }: TaskWaypointProps) {
  return (
    <article className="relative pl-10">
      <span
        className="absolute left-0 top-1 flex size-10 items-center justify-center rounded-full bg-card"
        aria-hidden="true"
      >
        <span className="size-4 rounded-full border-2 border-switchback-gold bg-card shadow-sm" />
      </span>

      <div className="rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Waypoint {task.order}
            </p>
            <h3 className="font-heading text-base font-semibold text-foreground">
              {task.title}
            </h3>
            {task.description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {task.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {task.externalLink ? (
              <Link
                href={task.externalLink}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <ExternalLink aria-hidden="true" />
                Open
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-border/50 pt-4">
          <details className="group rounded-lg border border-border/60 bg-background/50 p-3">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-foreground marker:hidden">
              <Pencil className="size-4 text-trail-blaze" aria-hidden="true" />
              Edit waypoint
            </summary>
            <div className="mt-4">
              <TaskForm
                mode="edit"
                taskId={task.id}
                defaultValues={task}
                submitLabel="Save Waypoint"
              />
            </div>
          </details>

          <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
        </div>
      </div>
    </article>
  );
}
