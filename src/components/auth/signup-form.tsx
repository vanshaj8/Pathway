"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction, type AuthFormState } from "@/lib/auth/actions";

const initialState: AuthFormState = {};

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

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <AuthShell
      title="Start your trail"
      description="Create an account to begin mapping your journeys."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-trail-blaze underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4" noValidate>
        {state.errors?.form ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {state.errors.form[0]}
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!state.errors?.name}
          />
          <FieldError messages={state.errors?.name} />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!state.errors?.email}
            required
          />
          <FieldError messages={state.errors?.email} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!state.errors?.password}
            required
          />
          <FieldError messages={state.errors?.password} />
        </div>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
