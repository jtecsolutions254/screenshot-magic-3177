import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <div className={cn("panel p-5", highlight && "ring-1 ring-primary/25")}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            highlight ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="stat-value mt-4 text-3xl text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
