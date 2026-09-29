import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet, TrendingUp, Users, Router as RouterIcon, Activity, Wifi } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { money, useTenantRows, type Business } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [{ title: "Dashboard — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Dashboard" description="How your hotspot business is doing today.">
      <WithBusiness>{(b) => <Dashboard business={b} />}</WithBusiness>
    </OwnerShell>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function Dashboard({ business }: { business: Business }) {
  const { data: payments = [] } = useTenantRows<Row>("payments", business.id);
  const { data: subs = [] } = useTenantRows<Row>("subscribers", business.id);
  const { data: routers = [] } = useTenantRows<Row>("routers", business.id);
  const { data: sessions = [] } = useTenantRows<Row>("sessions", business.id);
  const { data: plans = [] } = useTenantRows<Row>("plans", business.id);

  const now = new Date();
  const today = now.toDateString();
  const sum = (rows: Row[]) => rows.reduce((s, r) => s + Number(r.amount), 0);
  const revToday = sum(payments.filter((p) => new Date(p.created_at).toDateString() === today));
  const revMonth = sum(
    payments.filter((p) => {
      const d = new Date(p.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }),
  );
  const active = sessions.filter((s) => !s.ended_at).length;
  const online = routers.filter((r) => r.status === "online").length;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      revenue: sum(payments.filter((p) => new Date(p.created_at).toDateString() === d.toDateString())),
    };
  });

  const setupDone = business.published && routers.length > 0 && plans.length > 0;

  return (
    <div className="space-y-6">
      {!setupDone && (
        <div className="panel flex flex-wrap items-center justify-between gap-4 border-primary/40 p-5">
          <div>
            <p className="font-medium text-foreground">Finish setting up {business.name}</p>
            <p className="text-sm text-muted-foreground">
              Add a router, create plans and publish your customer page to start selling.
            </p>
          </div>
          <Button asChild>
            <Link to="/app/setup">Continue setup</Link>
          </Button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Revenue today" value={money(business, revToday)} icon={Wallet} />
        <StatCard label="Revenue this month" value={money(business, revMonth)} icon={TrendingUp} />
        <StatCard label="Active users" value={String(active)} icon={Wifi} />
        <StatCard label="Total subscribers" value={String(subs.length)} icon={Users} />
        <StatCard label="Online routers" value={`${online} / ${routers.length}`} icon={RouterIcon} />
        <StatCard label="Active sessions" value={String(active)} icon={Activity} />
      </div>
      <div className="panel p-5">
        <p className="font-display font-semibold text-foreground">Revenue — last 7 days</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
              />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
