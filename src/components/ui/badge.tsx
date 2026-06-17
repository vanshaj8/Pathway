import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span"> & {
  variant?: "default" | "trail";
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variant === "default" &&
          "border-border bg-muted text-muted-foreground",
        variant === "trail" &&
          "border-contour-sage/30 bg-contour-sage/15 text-basecamp-ink",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
