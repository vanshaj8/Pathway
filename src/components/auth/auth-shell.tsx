"use client";

import Link from "next/link";
import { Mountain } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex min-h-full flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--contour-sage)_0%,transparent_50%)] opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--switchback-gold)_0%,transparent_45%)] opacity-15" />

      <header className="relative z-10 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Mountain
              className="size-5 text-trail-blaze transition-transform group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Pathway
            </span>
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6"
      >
        <Card className="border-border/70 bg-card/95 shadow-sm backdrop-blur-sm">
          <CardHeader className="gap-2 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-contour-sage">
              Trail access
            </p>
            <CardTitle className="font-heading text-2xl font-bold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">{children}</CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </main>
    </div>
  );
}
