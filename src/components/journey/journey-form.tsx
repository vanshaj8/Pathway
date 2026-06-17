"use client";

import { useActionState } from "react";

import {
  createJourneyAction,
  updateJourneyAction,
  type JourneyFormState,
} from "@/actions/journey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: JourneyFormState = {};

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

type JourneyFormProps = {
  mode: "create" | "edit";
  journeyId?: string;
  defaultValues?: {
    title: string;
    category?: string | null;
    description?: string | null;
  };
};

export function JourneyForm({ mode, journeyId, defaultValues }: JourneyFormProps) {
  const action =
    mode === "create"
      ? createJourneyAction
      : updateJourneyAction.bind(null, journeyId ?? "");

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.errors?.form ? (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.errors.form[0]}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Master TypeScript"
          defaultValue={defaultValues?.title ?? ""}
          aria-invalid={!!state.errors?.title}
          required
        />
        <FieldError messages={state.errors?.title} />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium text-foreground">
          Category{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="category"
          name="category"
          type="text"
          placeholder="e.g. Software Engineering"
          defaultValue={defaultValues?.category ?? ""}
          aria-invalid={!!state.errors?.category}
        />
        <FieldError messages={state.errors?.category} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          Description{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="What does mastery look like on this trail?"
          defaultValue={defaultValues?.description ?? ""}
          aria-invalid={!!state.errors?.description}
        />
        <FieldError messages={state.errors?.description} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" className="h-10" disabled={pending}>
          {pending
            ? mode === "create"
              ? "Creating trail…"
              : "Saving changes…"
            : mode === "create"
              ? "Create Journey"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
