"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction, type AuthFormState } from "@/lib/auth/actions";

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

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue your journey."
      footer={
        <>
          New to Pathway?{" "}
          <Link
            href="/signup"
            className="font-medium text-trail-blaze underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Create an account
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
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={!!state.errors?.password}
            required
          />
          <FieldError messages={state.errors?.password} />
        </div>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
