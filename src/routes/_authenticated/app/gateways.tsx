import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { gatewayDrivers, type GatewayDriver } from "@/lib/tenant-config";
import { useInvalidateTenant, useTenantRows, type Business } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/app/gateways")({
  head: () => ({ meta: [{ title: "Payment setup — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell
      title="Payment setup"
      description="Connect the payment service your customers use. You can switch providers any time — plans, vouchers and reports stay the same."
    >
      <WithBusiness>{(b) => <Gateways business={b} />}</WithBusiness>
    </OwnerShell>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function Gateways({ business }: { business: Business }) {
  const { data: rows = [] } = useTenantRows<Row>("gateway_settings", business.id);
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {gatewayDrivers.map((d) => (
        <GatewayCard key={d.id} driver={d} business={business} existing={rows.find((r) => r.provider === d.id)} />
      ))}
    </div>
  );
}

function GatewayCard({ driver, business, existing }: { driver: GatewayDriver; business: Business; existing?: Row }) {
  const invalidate = useInvalidateTenant();
  const [values, setValues] = useState<Record<string, string>>({});

  async function save() {
    const missing = driver.fields.find((f) => !values[f.key] && !existing);
    if (missing) return toast.error(`${missing.label} is required`);
    const { error } = await supabase.from("gateway_settings").upsert(
      {
        business_id: business.id,
        provider: driver.id,
        config: { ...(existing?.config ?? {}), ...values },
        enabled: true,
      },
      { onConflict: "business_id,provider" },
    );
    if (error) return toast.error(error.message);
    toast.success(`${driver.name} connected`);
    setValues({});
    invalidate("gateway_settings");
  }

  return (
    <div className="panel flex flex-col p-5">
      <div className="flex items-start justify-between">
        <p className="font-display text-lg font-semibold text-foreground">{driver.name}</p>
        <StatusPill status={existing ? "active" : "pending"} />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{driver.blurb}</p>
      <p className="mt-1 text-xs text-muted-foreground">{driver.regions}</p>
      <div className="mt-4 space-y-3">
        {driver.fields.map((f) => (
          <div key={f.key} className="space-y-1">
            <Label className="text-xs">{f.label}</Label>
            <Input
              type={f.secret ? "password" : "text"}
              placeholder={existing ? "Saved — leave blank to keep" : f.placeholder}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <Button className="mt-4" onClick={save}>
        {existing ? "Update" : "Connect"}
      </Button>
    </div>
  );
}
