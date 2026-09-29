import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { TenantResource } from "@/components/tenant-resource";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/_authenticated/app/sessions")({
  head: () => ({ meta: [{ title: "Sessions — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell
      title="Sessions"
      description="Who is online right now. Sessions are reported by your routers once they are connected."
    >
      <WithBusiness>
        {(b) => (
          <TenantResource
            table="sessions"
            businessId={b.id}
            canAdd={false}
            addLabel=""
            emptyText="No sessions yet. They appear automatically when customers connect through your routers."
            fields={[]}
            columns={[
              { label: "User", render: (r) => <span className="font-mono">{r.username}</span> },
              { label: "Device", render: (r) => r.mac ?? "—" },
              { label: "Started", render: (r) => new Date(r.started_at).toLocaleString() },
              { label: "Data", render: (r) => `${(Number(r.bytes_used) / 1e6).toFixed(1)} MB` },
              { label: "Status", render: (r) => <StatusPill status={r.ended_at ? "expired" : "online"} /> },
            ]}
          />
        )}
      </WithBusiness>
    </OwnerShell>
  ),
});
