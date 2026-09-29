import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Router as RouterIcon,
  Users,
  Wifi,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminShell } from "@/components/admin-shell";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import {
  formatMoney,
  payments,
  platformStats,
  revenueSeries,
  routers,
  tenants,
} from "@/lib/platform-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Platform Overview | Kwetu Connection" },
      {
        name: "description",
        content:
          "Central console for Kwetu Connection: monitor hotspot businesses, routers, subscribers and revenue in one place.",
      },
      { property: "og:title", content: "Platform Overview | Kwetu Connection" },
      {
        property: "og:description",
        content:
          "Monitor every hotspot business, router and payment across the Kwetu Connection platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <AdminShell
      title="Platform overview"
      description="Everything happening across every hotspot business on Kwetu Connection, in one view."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue today"
          value={formatMoney(platformStats.revenueToday)}
          hint={`${formatMoney(platformStats.revenueMonth)} this month`}
          icon={Wallet}
          highlight
        />
        <StatCard
          label="Active sessions"
          value={platformStats.activeSessions.toLocaleString()}
          hint="Users connected right now"
          icon={Wifi}
        />
        <StatCard
          label="Businesses"
          value={`${platformStats.activeTenants} / ${platformStats.totalTenants}`}
          hint="Active of total signed up"
          icon={Building2}
        />
        <StatCard
          label="Routers online"
          value={`${platformStats.onlineRouters} / ${platformStats.totalRouters}`}
          hint="Reporting in the last 5 minutes"
          icon={RouterIcon}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="panel p-6 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Revenue and sessions</h2>
              <p className="text-sm text-muted-foreground">Last 7 days, all businesses</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
              <TrendingUp className="size-3.5" /> +18.4% week on week
            </span>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--color-muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={64}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    color: "var(--color-popover-foreground)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-chart-2)"
                  fill="url(#ses)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-lg font-semibold">System health</h2>
          <p className="text-sm text-muted-foreground">Mocked until services are connected</p>

          <ul className="mt-5 space-y-3">
            {[
              { name: "Payment success rate", value: `${platformStats.paymentSuccessRate}%`, ok: true },
              { name: "RADIUS service", value: "Not connected", ok: false },
              { name: "Router VPN tunnel", value: "Not connected", ok: false },
              { name: "Captive portal engine", value: "Planned", ok: false },
            ].map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-sm text-foreground">
                  {row.ok ? (
                    <ShieldCheck className="size-4 text-success" />
                  ) : (
                    <Activity className="size-4 text-muted-foreground" />
                  )}
                  {row.name}
                </span>
                <span className="text-xs text-muted-foreground">{row.value}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-primary/25 bg-primary/8 p-4">
            <p className="text-sm font-medium text-primary">Next step</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Add business onboarding and the branded customer portal, then connect real routers
              and payments.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top businesses</h2>
            <Link to="/businesses" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {tenants.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.owner} · {t.locations} locations · {t.subscribers.toLocaleString()} users
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {formatMoney(t.monthlyRevenue, t.currency)}
                  </p>
                  <StatusPill status={t.status} className="mt-1" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Needs attention</h2>
            <Link to="/routers" className="text-xs font-medium text-primary hover:underline">
              All routers
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {routers
              .filter((r) => r.status !== "online")
              .map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.tenant} · {r.location} · seen {r.lastSeen}
                    </p>
                  </div>
                  <StatusPill status={r.status} />
                </li>
              ))}
          </ul>

          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="size-4" />
            {platformStats.totalSubscribers.toLocaleString()} subscribers across the platform
          </div>
        </section>
      </div>

      <section className="panel mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Latest payments</h2>
          <Link to="/payments" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Business</th>
                <th className="pb-3 font-medium">Method</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{p.reference}</td>
                  <td className="py-3">{p.tenant}</td>
                  <td className="py-3 text-muted-foreground">{p.method}</td>
                  <td className="py-3">{formatMoney(p.amount, p.currency)}</td>
                  <td className="py-3">
                    <StatusPill status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
