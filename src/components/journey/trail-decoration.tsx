import { cn } from "@/lib/utils";

type TrailDecorationProps = {
  className?: string;
  variant?: "card" | "hero";
};

export function TrailDecoration({
  className,
  variant = "card",
}: TrailDecorationProps) {
  const height = variant === "hero" ? 48 : 28;

  return (
    <svg
      viewBox="0 0 200 28"
      aria-hidden="true"
      className={cn("w-full text-trail-blaze", className)}
      style={{ height }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="card-trail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--contour-sage)" />
          <stop offset="50%" stopColor="var(--switchback-gold)" />
          <stop offset="100%" stopColor="var(--trail-blaze)" />
        </linearGradient>
      </defs>
      <path
        d="M 0 20 C 30 18, 50 14, 70 16 S 110 10, 130 12 S 165 6, 200 8"
        fill="none"
        stroke="url(#card-trail-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength="1"
        className="trail-line"
      />
      <circle cx="70" cy="16" r="2.5" fill="var(--switchback-gold)" opacity="0.9" />
      <circle cx="130" cy="12" r="2.5" fill="var(--switchback-gold)" opacity="0.9" />
      <circle cx="200" cy="8" r="3" fill="var(--trail-blaze)" />
    </svg>
  );
}
