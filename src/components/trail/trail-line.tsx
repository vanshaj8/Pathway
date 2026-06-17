import { cn } from "@/lib/utils";

type TrailLineProps = {
  className?: string;
};

export function TrailLine({ className }: TrailLineProps) {
  return (
    <div
      className={cn(
        "absolute left-5 top-0 h-full w-px bg-gradient-to-b from-contour-sage via-trail-blaze to-switchback-gold",
        className
      )}
      aria-hidden="true"
    />
  );
}
