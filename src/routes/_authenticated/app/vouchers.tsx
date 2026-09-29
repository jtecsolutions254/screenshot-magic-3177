import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Ticket, Printer } from "lucide-react";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { TenantResource } from "@/components/tenant-resource";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useInvalidateTenant, useTenantRows, type Business } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/app/vouchers")({
  head: () => ({ meta: [{ title: "Vouchers — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Vouchers" description="Print codes to sell for cash. Customers type the code on your Wi-Fi page.">
      <WithBusiness>{(b) => <Vouchers business={b} />}</WithBusiness>
    </OwnerShell>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function code() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(8)), (x) => chars[x % chars.length]).join("");
}

function Vouchers({ business }: { business: Business }) {
  const { data: plans = [] } = useTenantRows<Row>("plans", business.id);
  const invalidate = useInvalidateTenant();
  const [planId, setPlanId] = useState("");
  const [count, setCount] = useState(10);
  const [busy, setBusy] = useState(false);

  async function generate() {
    if (!planId) return toast.error("Choose a plan");
    const n = Math.min(Math.max(count, 1), 200);
    setBusy(true);
    const rows = Array.from({ length: n }, () => ({ business_id: business.id, plan_id: planId, code: code() }));
    const { error } = await supabase.from("vouchers").insert(rows);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${n} vouchers created`);
    invalidate("vouchers");
  }

  return (
    <div className="space-y-6">
      <div className="panel grid gap-4 p-5 sm:grid-cols-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Plan</Label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="">Choose a plan…</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {business.currency} {p.price}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>How many</Label>
          <Input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={generate} disabled={busy} className="flex-1">
            <Ticket className="size-4" /> Generate
          </Button>
          <Button variant="outline" onClick={() => window.print()} aria-label="Print">
            <Printer className="size-4" />
          </Button>
        </div>
      </div>
      <TenantResource
        table="vouchers"
        businessId={business.id}
        canAdd={false}
        addLabel=""
        fields={[]}
        emptyText="No vouchers yet."
        columns={[
          { label: "Code", render: (r) => <span className="font-mono tracking-widest">{r.code}</span> },
          { label: "Plan", render: (r) => plans.find((p) => p.id === r.plan_id)?.name ?? "—" },
          { label: "Status", render: (r) => <StatusPill status={r.status === "unused" ? "active" : "expired"} /> },
          { label: "Created", render: (r) => new Date(r.created_at).toLocaleDateString() },
        ]}
      />
    </div>
  );
}
