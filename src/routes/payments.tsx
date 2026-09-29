import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { StatusPill } from "@/components/status-pill";
import { formatMoney, payments, platformStats } from "@/lib/platform-data";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payments | Kwetu Connection" },
      {
        name: "description",
        content:
          "Every hotspot package payment across the platform, with method, amount and settlement status.",
      },
      { property: "og:title", content: "Payments | Kwetu Connection" },
      {
        property: "og:description",
        content: "Track package payments and success rates across all hotspot businesses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Payments,
});

function Payments() {
  return (
    <AdminShell
      title="Payments"
      description="Package payments across all businesses. Simulated for now — no real money moves yet."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Today</p>
          <p className="stat-value mt-3 text-2xl">{formatMoney(platformStats.revenueToday)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">This month</p>
          <p className="stat-value mt-3 text-2xl">{formatMoney(platformStats.revenueMonth)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Success rate</p>
          <p className="stat-value mt-3 text-2xl">{platformStats.paymentSuccessRate}%</p>
        </div>
      </div>

      <div className="panel mt-6 overflow-x-auto p-2">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {p.reference}
                </td>
                <td className="px-4 py-3 text-foreground">{p.tenant}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
                <td className="px-4 py-3">{formatMoney(p.amount, p.currency)}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.createdAt}</td>
                <td className="px-4 py-3">
                  <StatusPill status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
