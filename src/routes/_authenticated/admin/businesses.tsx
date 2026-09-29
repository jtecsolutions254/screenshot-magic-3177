import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { StatusPill } from "@/components/status-pill";
import { formatMoney, tenants } from "@/lib/platform-data";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

function LiveBusinesses() {
  const { data = [], refetch } = useQuery({
    queryKey: ["admin-businesses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("businesses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("businesses").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
  }
  return (
    <div className="panel mb-8 overflow-x-auto">
      <p className="border-b border-border px-4 py-3 font-display font-semibold text-foreground">Signed-up businesses</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-2">Business</th><th className="px-4 py-2">Owner</th><th className="px-4 py-2">Country</th>
            <th className="px-4 py-2">Setup</th><th className="px-4 py-2">Status</th><th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {data.map((b) => (
            <tr key={b.id} className="border-t border-border/60">
              <td className="px-4 py-2 font-medium text-foreground">{b.name}<span className="ml-2 font-mono text-xs text-muted-foreground">{b.slug}</span></td>
              <td className="px-4 py-2 text-muted-foreground">{b.owner_name ?? b.email ?? "—"}</td>
              <td className="px-4 py-2 text-muted-foreground">{b.country}</td>
              <td className="px-4 py-2 text-muted-foreground">{b.published ? "Live" : `Step ${Math.min(b.setup_step, 9)} of 9`}</td>
              <td className="px-4 py-2"><StatusPill status={b.status} /></td>
              <td className="px-4 py-2 text-right">
                <button className="text-xs text-primary" onClick={() => setStatus(b.id, b.status === "suspended" ? "active" : "suspended")}>
                  {b.status === "suspended" ? "Reactivate" : "Suspend"}
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No businesses yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/businesses")({
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
      <LiveBusinesses />
      <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Sample data</p>
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
