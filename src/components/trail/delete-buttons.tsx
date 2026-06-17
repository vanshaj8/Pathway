"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteTaskAction } from "@/actions/task";
import { deleteTopicAction } from "@/actions/topic";
import { Button } from "@/components/ui/button";

type DeleteTopicButtonProps = {
  topicId: string;
  topicTitle: string;
};

type DeleteTaskButtonProps = {
  taskId: string;
  taskTitle: string;
};

export function DeleteTopicButton({
  topicId,
  topicTitle,
}: DeleteTopicButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${topicTitle}"? This will permanently remove the topic and its tasks.`
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await deleteTopicAction(topicId);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 aria-hidden="true" />
        {isPending ? "Deleting..." : "Delete"}
      </Button>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function DeleteTaskButton({ taskId, taskTitle }: DeleteTaskButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${taskTitle}"? This waypoint will be permanently removed.`
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await deleteTaskAction(taskId);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 aria-hidden="true" />
        {isPending ? "Deleting..." : "Delete"}
      </Button>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
