import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { StatusPill } from "@/components/status-pill";
import { routers } from "@/lib/platform-data";

export const Route = createFileRoute("/_authenticated/admin/routers")({
  head: () => ({
    meta: [
      { title: "Router Fleet | Kwetu Connection" },
      {
        name: "description",
        content:
          "Live status of every MikroTik router across all hotspot businesses: uptime, load, sessions and last contact.",
      },
      { property: "og:title", content: "Router Fleet | Kwetu Connection" },
      {
        property: "og:description",
        content: "Monitor router health, load and active sessions across every hotspot location.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Routers,
});

function Bar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className={
            value > 80 ? "h-full rounded-full bg-destructive" : "h-full rounded-full bg-primary"
          }
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

function Routers() {
  return (
    <AdminShell
      title="Router fleet"
      description="Hardware across every business and location. Live figures arrive once routers are connected."
    >
      <div className="panel overflow-x-auto p-2">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Router</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">VPN IP</th>
              <th className="px-4 py-3 font-medium">Load</th>
              <th className="px-4 py-3 font-medium">Memory</th>
              <th className="px-4 py-3 font-medium">Sessions</th>
              <th className="px-4 py-3 font-medium">Last seen</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {routers.map((r) => (
              <tr key={r.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.model} · RouterOS {r.routerOs}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.tenant}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.location}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.vpnIp}</td>
                <td className="px-4 py-3">
                  <Bar value={r.cpu} />
                </td>
                <td className="px-4 py-3">
                  <Bar value={r.memory} />
                </td>
                <td className="px-4 py-3">{r.activeSessions}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.lastSeen}</td>
                <td className="px-4 py-3">
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
