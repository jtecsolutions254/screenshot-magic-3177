import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Router as RouterIcon,
  Users,
  CreditCard,
  Signal,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/businesses", label: "Businesses", icon: Building2 },
  { to: "/routers", label: "Routers", icon: RouterIcon },
  { to: "/subscribers", label: "Subscribers", icon: Users },
  { to: "/payments", label: "Payments", icon: CreditCard },
];

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Signal className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold text-sidebar-foreground">
                KWETU CONNECTION
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Platform console
              </p>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
            <p className="text-xs font-medium text-sidebar-foreground">Demo data</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Figures are sample values. Router and payment connections come next.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="grid-backdrop border-b border-border px-6 py-8 lg:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
              Super admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>

            <nav className="mt-6 flex gap-2 overflow-x-auto lg:hidden">
              {nav.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium",
                      active
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <div className="px-6 py-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
