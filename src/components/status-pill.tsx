import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const toneClass: Record<Tone, string> = {
  success: "border-success/30 bg-success/12 text-success",
  warning: "border-warning/30 bg-warning/12 text-warning",
  danger: "border-destructive/35 bg-destructive/12 text-destructive",
  info: "border-primary/30 bg-primary/12 text-primary",
  neutral: "border-border bg-muted text-muted-foreground",
};

const map: Record<string, Tone> = {
  active: "success",
  online: "success",
  paid: "success",
  trial: "info",
  onboarding: "info",
  pending: "warning",
  degraded: "warning",
  processing: "warning",
  suspended: "danger",
  offline: "danger",
  failed: "danger",
  expired: "neutral",
  refunded: "neutral",
};

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const tone = map[status.toLowerCase()] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        toneClass[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
