import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { TenantResource } from "@/components/tenant-resource";

export const Route = createFileRoute("/_authenticated/app/subscribers")({
  head: () => ({ meta: [{ title: "Subscribers — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Subscribers" description="Customers who have bought internet from you.">
      <WithBusiness>
        {(b) => (
          <TenantResource
            table="subscribers"
            businessId={b.id}
            addLabel="Add subscriber"
            emptyText="No subscribers yet. They appear here after their first purchase."
            fields={[
              { key: "phone", label: "Phone", placeholder: "0712 345 678", required: true },
              { key: "name", label: "Name", placeholder: "Optional" },
            ]}
            columns={[
              { label: "Phone", render: (r) => <span className="font-mono">{r.phone}</span> },
              { label: "Name", render: (r) => r.name ?? "—" },
              { label: "Joined", render: (r) => new Date(r.created_at).toLocaleDateString() },
            ]}
          />
        )}
      </WithBusiness>
    </OwnerShell>
  ),
});
