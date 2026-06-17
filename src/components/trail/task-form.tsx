"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createTaskAction,
  updateTaskAction,
  type TaskFormState,
} from "@/actions/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: TaskFormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p className="text-sm text-destructive" role="alert">
      {messages[0]}
    </p>
  );
}

type TaskFormProps = {
  mode: "create" | "edit";
  topicId?: string;
  taskId?: string;
  defaultValues?: {
    title: string;
    description: string | null;
    externalLink: string | null;
    order: number;
  };
  submitLabel?: string;
};

export function TaskForm({
  mode,
  topicId,
  taskId,
  defaultValues,
  submitLabel,
}: TaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action =
    mode === "create"
      ? createTaskAction
      : updateTaskAction.bind(null, taskId ?? "");

  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldKey = taskId ?? topicId ?? "new";
  const titleId = `${mode}-task-title-${fieldKey}`;
  const descriptionId = `${mode}-task-description-${fieldKey}`;
  const externalLinkId = `${mode}-task-link-${fieldKey}`;
  const orderId = `${mode}-task-order-${fieldKey}`;

  useEffect(() => {
    if (mode === "create" && state.success) {
      formRef.current?.reset();
    }
  }, [mode, state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4" noValidate>
      {topicId ? <input type="hidden" name="topicId" value={topicId} /> : null}

      {state.errors?.form ? (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.errors.form[0]}
        </div>
      ) : null}

      {state.success && mode === "edit" ? (
        <p className="rounded-lg border border-contour-sage/30 bg-contour-sage/10 px-3 py-2 text-sm text-contour-sage">
          Task saved.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <div className="space-y-2">
          <label htmlFor={titleId} className="text-sm font-medium text-foreground">
            Task title
          </label>
          <Input
            id={titleId}
            name="title"
            type="text"
            placeholder="e.g. Solve five practice problems"
            defaultValue={defaultValues?.title ?? ""}
            aria-invalid={!!state.errors?.title}
            required
          />
          <FieldError messages={state.errors?.title} />
        </div>

        {mode === "edit" ? (
          <div className="space-y-2">
            <label
              htmlFor={orderId}
              className="text-sm font-medium text-foreground"
            >
              Order
            </label>
            <Input
              id={orderId}
              name="order"
              type="number"
              min={1}
              step={1}
              defaultValue={defaultValues?.order ?? 1}
              aria-invalid={!!state.errors?.order}
              required
            />
            <FieldError messages={state.errors?.order} />
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor={descriptionId}
          className="text-sm font-medium text-foreground"
        >
          Description{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id={descriptionId}
          name="description"
          placeholder="What should be done at this waypoint?"
          defaultValue={defaultValues?.description ?? ""}
          aria-invalid={!!state.errors?.description}
        />
        <FieldError messages={state.errors?.description} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor={externalLinkId}
          className="text-sm font-medium text-foreground"
        >
          External link{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input
          id={externalLinkId}
          name="externalLink"
          type="url"
          placeholder="https://example.com/resource"
          defaultValue={defaultValues?.externalLink ?? ""}
          aria-invalid={!!state.errors?.externalLink}
        />
        <FieldError messages={state.errors?.externalLink} />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel ?? "Save Task"}
      </Button>
    </form>
  );
}
