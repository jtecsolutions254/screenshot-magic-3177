import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  MapPin,
  Router as RouterIcon,
  Package,
  Ticket,
  Users,
  CreditCard,
  Activity,
  Palette,
  Wallet,
  UserCog,
  Settings,
  Rocket,
  LogOut,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMyBusiness } from "@/lib/business";
import { StatusPill } from "@/components/status-pill";
import { cn } from "@/lib/utils";

const nav: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/setup", label: "Setup guide", icon: Rocket },
  { to: "/app/locations", label: "Locations", icon: MapPin },
  { to: "/app/routers", label: "Routers", icon: RouterIcon },
  { to: "/app/plans", label: "Internet plans", icon: Package },
  { to: "/app/vouchers", label: "Vouchers", icon: Ticket },
  { to: "/app/subscribers", label: "Subscribers", icon: Users },
  { to: "/app/payments", label: "Payments", icon: CreditCard },
  { to: "/app/sessions", label: "Sessions", icon: Activity },
  { to: "/app/portal", label: "Customer page", icon: Palette },
  { to: "/app/gateways", label: "Payment setup", icon: Wallet },
  { to: "/app/staff", label: "Staff", icon: UserCog },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export async function signOut(
  qc: ReturnType<typeof useQueryClient>,
  navigate: ReturnType<typeof useNavigate>,
) {
  await qc.cancelQueries();
  qc.clear();
  await supabase.auth.signOut();
  navigate({ to: "/login", replace: true });
}

export function OwnerShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: business } = useMyBusiness();
  const qc = useQueryClient();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <span
              className="flex size-9 items-center justify-center rounded-lg text-sm font-bold text-background"
              style={{ background: business?.primary_color ?? "var(--primary)" }}
            >
              {(business?.name ?? "KC").slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-sm font-semibold text-sidebar-foreground">
                {business?.name ?? "Your business"}
              </p>
              <p className="text-[11px] text-muted-foreground">on Kwetu Connection</p>
            </div>
          </div>
          {business && (
            <div className="mt-3 flex items-center gap-2 px-2">
              <StatusPill status={business.published ? "active" : "pending"} />
              <span className="text-[11px] text-muted-foreground">
                {business.published ? "Live" : "Not published"}
              </span>
            </div>
          )}

          <nav className="mt-6 flex flex-col gap-0.5">
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

          <div className="mt-auto space-y-2 pt-6">
            {business?.published && (
              <Link
                to="/portal/$slug"
                params={{ slug: business.slug }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="size-4" /> Open customer page
              </Link>
            )}
            <button
              onClick={() => signOut(qc, navigate)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="grid-backdrop border-b border-border px-6 py-8 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
                  {business?.name ?? "Business workspace"}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">{title}</h1>
                {description && (
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              {actions}
            </div>
            <nav className="mt-6 flex gap-2 overflow-x-auto lg:hidden">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium",
                    pathname === item.to
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => signOut(qc, navigate)}
                className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
              >
                Sign out
              </button>
            </nav>
          </header>
          <div className="px-6 py-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
