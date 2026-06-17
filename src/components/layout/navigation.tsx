"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Mountain, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
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

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost" })}
            aria-label="Log in"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={buttonVariants()}
            aria-label="Get started"
          >
            Get Started
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border/60 bg-background md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants(), "w-full")}
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
