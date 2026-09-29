import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { StatusPill } from "@/components/status-pill";
import { subscribers } from "@/lib/platform-data";

export const Route = createFileRoute("/subscribers")({
  head: () => ({
    meta: [
      { title: "Subscribers | Kwetu Connection" },
      {
        name: "description",
        content:
          "Hotspot customers across all businesses with their package, data used and remaining time.",
      },
      { property: "og:title", content: "Subscribers | Kwetu Connection" },
      {
        property: "og:description",
        content: "See who is connected, on which package, and how much time they have left.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Subscribers,
});

function Subscribers() {
  return (
    <AdminShell
      title="Subscribers"
      description="Customers who bought internet packages across every hotspot business."
    >
      <div className="panel overflow-x-auto p-2">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Data used</th>
              <th className="px-4 py-3 font-medium">Time left</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">{s.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.tenant}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.location}</td>
                <td className="px-4 py-3">{s.plan}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(s.dataUsedMb / 1024).toFixed(2)} GB
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.expiresIn}</td>
                <td className="px-4 py-3">
                  <StatusPill status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
