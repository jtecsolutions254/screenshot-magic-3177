import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { TenantResource } from "@/components/tenant-resource";
import { money } from "@/lib/business";

export function durationText(min: number) {
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.round(min / 60)} h`;
  return `${Math.round(min / 1440)} day(s)`;
}

export const Route = createFileRoute("/_authenticated/app/plans")({
  head: () => ({ meta: [{ title: "Internet plans — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Internet plans" description="The packages customers can buy on your Wi-Fi page.">
      <WithBusiness>
        {(b) => (
          <TenantResource
            table="plans"
            businessId={b.id}
            addLabel="Add plan"
            emptyText="No plans yet."
            sort={(a, c) => Number(a.price) - Number(c.price)}
            fields={[
              { key: "name", label: "Plan name", placeholder: "1 Hour", required: true },
              { key: "price", label: `Price (${b.currency})`, type: "number", default: 50, required: true },
              { key: "duration_minutes", label: "Duration (minutes)", type: "number", default: 60, required: true },
              { key: "data_label", label: "Data", placeholder: "Unlimited", default: "Unlimited" },
              { key: "speed_label", label: "Speed", placeholder: "5 Mbps", default: "5 Mbps" },
              { key: "popular", label: "Mark as popular", type: "checkbox" },
            ]}
            columns={[
              { label: "Plan", render: (r) => <span className="font-medium">{r.name}{r.popular && <span className="ml-2 text-xs text-accent">Popular</span>}</span> },
              { label: "Price", render: (r) => money(b, Number(r.price)) },
              { label: "Duration", render: (r) => durationText(r.duration_minutes) },
              { label: "Data", render: (r) => r.data_label },
              { label: "Speed", render: (r) => r.speed_label },
            ]}
          />
        )}
      </WithBusiness>
    </OwnerShell>
  ),
});
