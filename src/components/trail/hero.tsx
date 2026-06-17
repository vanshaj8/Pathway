import { Button } from "@/components/ui/button";
import { ElevationProfile } from "@/components/trail/elevation-profile";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--contour-sage)_0%,transparent_55%)] opacity-20" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="flex flex-1 flex-col gap-6 lg:max-w-xl">
          <p className="font-mono text-sm uppercase tracking-widest text-contour-sage">
            Your path to mastery
          </p>

          <h1
            id="hero-heading"
            className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
          >
            Turn goals into repeatable journeys.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Track every attempt, compare your past paths, and master any skill.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" type="button" className="h-11 px-6 text-base">
              Start Your Journey
            </Button>
          </div>
        </div>

        <div className="flex flex-1 items-end justify-center lg:justify-end">
          <ElevationProfile />
        </div>
      </div>
    </section>
  );
}
