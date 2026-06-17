import Link from "next/link";
import { Mountain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/auth";

export function DashboardHeader() {
  return (
    <header className="border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
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

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
