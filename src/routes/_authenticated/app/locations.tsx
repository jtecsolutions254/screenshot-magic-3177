import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { TenantResource } from "@/components/tenant-resource";

export const Route = createFileRoute("/_authenticated/app/locations")({
  head: () => ({ meta: [{ title: "Locations — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Locations" description="Each place where you run Wi-Fi. Routers belong to a location.">
      <WithBusiness>
        {(b) => (
          <TenantResource
            table="locations"
            businessId={b.id}
            addLabel="Add location"
            emptyText="No locations yet — add your first site, e.g. CBD."
            fields={[
              { key: "name", label: "Location name", placeholder: "CBD", required: true },
              { key: "address", label: "Address", placeholder: "Moi Avenue, Nairobi" },
            ]}
            columns={[
              { label: "Name", render: (r) => r.name },
              { label: "Address", render: (r) => r.address ?? "—" },
              { label: "Added", render: (r) => new Date(r.created_at).toLocaleDateString() },
            ]}
          />
        )}
      </WithBusiness>
    </OwnerShell>
  ),
});
