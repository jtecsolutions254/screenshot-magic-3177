import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { StatusPill } from "@/components/status-pill";
import { formatMoney, tenants } from "@/lib/platform-data";

export const Route = createFileRoute("/businesses")({
  head: () => ({
    meta: [
      { title: "Hotspot Businesses | Kwetu Connection" },
      {
        name: "description",
        content:
          "Every hotspot business on Kwetu Connection with its owner, locations, routers, subscribers and monthly revenue.",
      },
      { property: "og:title", content: "Hotspot Businesses | Kwetu Connection" },
      {
        property: "og:description",
        content: "Manage every hotspot business account on the Kwetu Connection platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Businesses,
});

function Businesses() {
  return (
    <AdminShell
      title="Hotspot businesses"
      description="Each business runs its own locations, routers and packages under the Kwetu Connection platform."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tenants.map((t) => (
          <article key={t.id} className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">{t.name}</h2>
                <p className="text-xs text-muted-foreground">
                  portal.kwetuconnection.com/{t.slug}
                </p>
              </div>
              <StatusPill status={t.status} />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Owner</dt>
                <dd className="text-foreground">{t.owner}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Country</dt>
                <dd className="text-foreground">{t.country}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Locations</dt>
                <dd className="text-foreground">{t.locations}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Routers</dt>
                <dd className="text-foreground">{t.routers}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Subscribers</dt>
                <dd className="text-foreground">{t.subscribers.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Plan</dt>
                <dd className="text-foreground">{t.plan}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Monthly revenue</p>
                <p className="stat-value text-xl text-foreground">
                  {formatMoney(t.monthlyRevenue, t.currency)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Joined {t.joined}</p>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
