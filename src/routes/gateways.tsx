import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plug, CheckCircle2, Send } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusPill } from "@/components/status-pill";
import { gatewayDrivers, tenantConfigs, tenantOf, firstTenantSlug, type GatewayId } from "@/lib/tenant-config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gateways")({
  head: () => ({
    meta: [
      { title: "Payment connections — Kwetu Connection" },
      {
        name: "description",
        content: "Connect M-Pesa, Paystack or Flutterwave and test a live payment request.",
      },
      { property: "og:title", content: "Payment connections — Kwetu Connection" },
      {
        property: "og:description",
        content: "Set up how each hotspot business collects money from customers.",
      },
    ],
  }),
  component: GatewaysPage,
});

const slugs = Object.keys(tenantConfigs);

function GatewaysPage() {
  const [slug, setSlug] = useState(firstTenantSlug);
  const [active, setActive] = useState<GatewayId>("mpesa");
  const [values, setValues] = useState<Record<string, string>>({});
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const [testPhone, setTestPhone] = useState("");
  const [testAmount, setTestAmount] = useState("20");
  const [testing, setTesting] = useState(false);
  const [callback, setCallback] = useState<string | null>(null);

  const driver = gatewayDrivers.find((d) => d.id === active)!;
  const key = `${slug}:${active}`;
  const isConnected = Boolean(connected[key]);

  function save() {
    const missing = driver.fields.filter((f) => !values[`${key}:${f.key}`]?.trim());
    if (missing.length) {
      toast.error(`Fill in ${missing.map((m) => m.label.toLowerCase()).join(", ")}`);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setConnected({ ...connected, [key]: true });
      toast.success(`${driver.name} connected for ${tenantOf(slug).branding.name}`);
    }, 1400);
  }

  function runTest() {
    if (!isConnected) {
      toast.error("Connect this payment method first");
      return;
    }
    if (testPhone.trim().length < 9) {
      toast.error("Enter a phone number to test with");
      return;
    }
    setTesting(true);
    setCallback(null);
    setTimeout(() => {
      setTesting(false);
      const ref = `KW${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setCallback(
        JSON.stringify(
          {
            provider: driver.id,
            business: slug,
            reference: ref,
            amount: Number(testAmount),
            currency: tenantOf(slug).branding.currency,
            phone: testPhone,
            status: "success",
            voucherIssued: `${ref}-1H`,
            receivedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
      toast.success("Test payment confirmed and a voucher was issued");
    }, 2400);
  }

  return (
    <AdminShell
      title="Payment connections"
      description="Choose how each hotspot business collects money, then send a test payment to confirm it works."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Business</Label>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          {slugs.map((s) => (
            <option key={s} value={s}>
              {tenantOf(s).branding.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {gatewayDrivers.map((d) => {
          const on = Boolean(connected[`${slug}:${d.id}`]);
          return (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={cn(
                "panel p-5 text-left transition",
                active === d.id ? "ring-1 ring-primary/40" : "hover:bg-muted/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-base font-semibold text-foreground">{d.name}</p>
                <StatusPill status={on ? "active" : "pending"} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d.blurb}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {d.regions}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Plug className="size-4 text-primary" /> {driver.name} details
          </p>
          <div className="mt-4 space-y-4">
            {driver.fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {f.label}
                </Label>
                <Input
                  type={f.secret ? "password" : "text"}
                  placeholder={f.placeholder}
                  value={values[`${key}:${f.key}`] ?? ""}
                  onChange={(e) => setValues({ ...values, [`${key}:${f.key}`]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Connecting…
              </>
            ) : isConnected ? (
              "Update connection"
            ) : (
              "Connect"
            )}
          </Button>
          {isConnected ? (
            <p className="mt-3 flex items-center gap-2 text-xs text-success">
              <CheckCircle2 className="size-4" /> Connected for{" "}
              {tenantOf(slug).branding.name}
            </p>
          ) : null}
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            Accepted payment methods: {driver.methods.join(", ")}. Switching provider later does not
            change how packages, vouchers or reports work.
          </p>
        </div>

        <div className="panel p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Send className="size-4 text-primary" /> Send a test payment
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Phone number
              </Label>
              <Input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="+254 7.." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Amount ({tenantOf(slug).branding.currency})
              </Label>
              <Input value={testAmount} onChange={(e) => setTestAmount(e.target.value)} inputMode="numeric" />
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={runTest} disabled={testing}>
            {testing ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Waiting for confirmation…
              </>
            ) : (
              "Send test request"
            )}
          </Button>

          <div className="mt-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Confirmation received
            </p>
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
              {callback ?? "No test payment yet."}
            </pre>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
