import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useMyBusiness, type Business } from "@/lib/business";

export function WithBusiness({ children }: { children: (b: Business) => ReactNode }) {
  const { data, isLoading } = useMyBusiness();
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data)
    return (
      <p className="text-sm text-muted-foreground">
        No business yet.{" "}
        <Link to="/app/setup" className="text-primary underline">
          Start setup
        </Link>
      </p>
    );
  return <>{children(data)}</>;
}
