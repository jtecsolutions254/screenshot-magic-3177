import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { TenantResource } from "@/components/tenant-resource";

export const Route = createFileRoute("/_authenticated/app/staff")({
  head: () => ({ meta: [{ title: "Staff — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Staff" description="People who help you run the business.">
      <WithBusiness>
        {(b) => (
          <TenantResource
            table="staff"
            businessId={b.id}
            addLabel="Add staff member"
            emptyText="Only you for now."
            fields={[
              { key: "name", label: "Name", required: true },
              { key: "email", label: "Email", required: true },
              {
                key: "role",
                label: "Role",
                type: "select",
                default: "cashier",
                options: [
                  { value: "manager", label: "Manager" },
                  { value: "cashier", label: "Cashier (sells vouchers)" },
                  { value: "technician", label: "Technician (routers)" },
                ],
              },
            ]}
            columns={[
              { label: "Name", render: (r) => r.name },
              { label: "Email", render: (r) => r.email },
              { label: "Role", render: (r) => <span className="capitalize">{r.role}</span> },
            ]}
          />
        )}
      </WithBusiness>
    </OwnerShell>
  ),
});
