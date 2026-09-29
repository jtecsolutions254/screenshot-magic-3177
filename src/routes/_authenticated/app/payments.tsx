import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { TenantResource } from "@/components/tenant-resource";
import { StatusPill } from "@/components/status-pill";
import { money } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/app/payments")({
  head: () => ({ meta: [{ title: "Payments — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Payments" description="Money received from customers. Cash sales can be recorded by hand.">
      <WithBusiness>
        {(b) => (
          <TenantResource
            table="payments"
            businessId={b.id}
            addLabel="Record cash payment"
            emptyText="No payments yet."
            fields={[
              { key: "phone", label: "Customer phone" },
              { key: "amount", label: `Amount (${b.currency})`, type: "number", required: true },
            ]}
            transform={(v) => ({ ...v, provider: "cash", reference: `CASH-${Date.now().toString(36).toUpperCase()}` })}
            columns={[
              { label: "When", render: (r) => new Date(r.created_at).toLocaleString() },
              { label: "Phone", render: (r) => r.phone ?? "—" },
              { label: "Amount", render: (r) => money(b, Number(r.amount)) },
              { label: "Method", render: (r) => <span className="capitalize">{r.provider}</span> },
              { label: "Reference", render: (r) => <span className="font-mono text-xs">{r.reference}</span> },
              { label: "Status", render: (r) => <StatusPill status={r.status} /> },
            ]}
          />
        )}
      </WithBusiness>
    </OwnerShell>
  ),
});
