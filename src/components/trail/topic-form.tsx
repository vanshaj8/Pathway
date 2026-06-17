"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createTopicAction,
  updateTopicAction,
  type TopicFormState,
} from "@/actions/topic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: TopicFormState = {};

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

type TopicFormProps = {
  mode: "create" | "edit";
  journeyId?: string;
  topicId?: string;
  defaultValues?: {
    title: string;
    order: number;
  };
  submitLabel?: string;
};

export function TopicForm({
  mode,
  journeyId,
  topicId,
  defaultValues,
  submitLabel,
}: TopicFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action =
    mode === "create"
      ? createTopicAction
      : updateTopicAction.bind(null, topicId ?? "");

  const [state, formAction, pending] = useActionState(action, initialState);
  const titleId = `${mode}-topic-title-${topicId ?? journeyId ?? "new"}`;
  const orderId = `${mode}-topic-order-${topicId ?? journeyId ?? "new"}`;

  useEffect(() => {
    if (mode === "create" && state.success) {
      formRef.current?.reset();
    }
  }, [mode, state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4" noValidate>
      {journeyId ? (
        <input type="hidden" name="journeyId" value={journeyId} />
      ) : null}

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
          Topic saved.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <div className="space-y-2">
          <label htmlFor={titleId} className="text-sm font-medium text-foreground">
            Topic title
          </label>
          <Input
            id={titleId}
            name="title"
            type="text"
            placeholder="e.g. Dynamic Programming"
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

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel ?? "Save Topic"}
      </Button>
    </form>
  );
}
