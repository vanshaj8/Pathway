import { MapPinned, Pencil, Plus } from "lucide-react";

import { DeleteTopicButton } from "@/components/trail/delete-buttons";
import { TaskForm } from "@/components/trail/task-form";
import { TaskWaypoint } from "@/components/trail/task-waypoint";
import { TopicForm } from "@/components/trail/topic-form";
import type { TrailTopic } from "@/lib/journey/queries";

type TopicCardProps = {
  topic: TrailTopic;
};

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <article className="relative pl-10">
      <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full border border-contour-sage/30 bg-contour-sage/15">
        <MapPinned className="size-5 text-contour-sage" aria-hidden="true" />
      </div>

      <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-wider text-trail-blaze">
              Mile {topic.order}
            </p>
            <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
              {topic.title}
            </h2>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <details className="group rounded-lg border border-border/60 bg-background/50 p-3">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-foreground marker:hidden">
                <Pencil className="size-4 text-trail-blaze" aria-hidden="true" />
                Edit topic
              </summary>
              <div className="mt-4 w-full min-w-0 sm:w-96">
                <TopicForm
                  mode="edit"
                  topicId={topic.id}
                  defaultValues={{
                    title: topic.title,
                    order: topic.order,
                  }}
                  submitLabel="Save Topic"
                />
              </div>
            </details>

            <DeleteTopicButton topicId={topic.id} topicTitle={topic.title} />
          </div>
        </div>

        <div className="mt-6 space-y-5 border-t border-border/50 pt-5">
          {topic.tasks.length > 0 ? (
            <div className="space-y-4">
              {topic.tasks.map((task) => (
                <TaskWaypoint key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/25 p-5">
              <h3 className="font-heading text-base font-semibold text-foreground">
                No waypoints on this segment.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Add tasks that mark the milestones along this trail.
              </p>
            </div>
          )}

          <details className="group rounded-xl border border-contour-sage/30 bg-contour-sage/10 p-4">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-foreground marker:hidden">
              <Plus className="size-4 text-trail-blaze" aria-hidden="true" />
              {topic.tasks.length > 0 ? "Add Task" : "Add First Task"}
            </summary>
            <div className="mt-4">
              <TaskForm
                mode="create"
                topicId={topic.id}
                submitLabel={
                  topic.tasks.length > 0 ? "Add Task" : "Add First Task"
                }
              />
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}
