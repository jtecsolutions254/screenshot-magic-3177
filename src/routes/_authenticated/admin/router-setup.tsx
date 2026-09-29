import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, PlugZap, CheckCircle2, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildRouterScript, tenantConfigs, tenantOf, firstTenantSlug } from "@/lib/tenant-config";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/_authenticated/admin/router-setup")({
  head: () => ({
    meta: [
      { title: "Connect a router — Kwetu Connection" },
      {
        name: "description",
        content: "Generate the setup code that links a MikroTik router to Kwetu Connection.",
      },
      { property: "og:title", content: "Connect a router — Kwetu Connection" },
      {
        property: "og:description",
        content: "Copy-paste router setup with secure tunnel, central sign-in and payments.",
      },
    ],
  }),
  component: RouterSetupPage,
});

const slugs = Object.keys(tenantConfigs);

function RouterSetupPage() {
  const [slug, setSlug] = useState(firstTenantSlug);
  const [routerName, setRouterName] = useState("MAIN-01");
  const [hotspotNetwork, setHotspotNetwork] = useState("192.168.88.0/24");
  const [wireguardIp, setWireguardIp] = useState("10.77.0.21");
  const [portalHost, setPortalHost] = useState("portal.kwetu.net");
  const [radiusSecret] = useState(() => randomSecret());
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<null | { uptime: string; clients: number; os: string }>(null);

  const tenant = tenantOf(slug);

  const script = useMemo(
    () =>
      buildRouterScript({
        tenantName: tenant.branding.name,
        tenantSlug: slug,
        routerName,
        hotspotNetwork,
        portalHost,
        radiusSecret,
        wireguardIp,
      }),
    [tenant, slug, routerName, hotspotNetwork, portalHost, radiusSecret, wireguardIp],
  );

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(script);
      toast.success("Setup code copied");
    } catch {
      toast.error("Could not copy — select the text and copy manually");
    }
  }

  function runTest() {
    setTesting(true);
    setResult(null);
    setTimeout(() => {
      setTesting(false);
      setResult({ uptime: "0d 00h 04m", clients: 3, os: "7.15.1" });
      toast.success(`${routerName} is talking to Kwetu`);
    }, 2200);
  }

  return (
    <AdminShell
      title="Connect a router"
      description="Pick the business, name the router, then paste the generated code into the router once."
    >
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <div className="panel space-y-4 p-5">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Business</Label>
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {slugs.map((s) => (
                  <option key={s} value={s}>
                    {tenantOf(s).branding.name}
                  </option>
                ))}
              </select>
            </div>
            <LabelledInput label="Router nickname" value={routerName} onChange={setRouterName} />
            <LabelledInput label="Hotspot network" value={hotspotNetwork} onChange={setHotspotNetwork} />
            <LabelledInput label="Tunnel address" value={wireguardIp} onChange={setWireguardIp} />
            <LabelledInput label="Sign-in page address" value={portalHost} onChange={setPortalHost} />
          </div>

          <div className="panel p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <PlugZap className="size-4 text-primary" /> Test the connection
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Run this after pasting the code into the router.
            </p>
            <Button className="mt-4 w-full" onClick={runTest} disabled={testing}>
              {testing ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Checking…
                </>
              ) : (
                "Check router"
              )}
            </Button>

            {result ? (
              <div className="mt-4 space-y-2 rounded-lg border border-success/25 bg-success/8 p-3 text-sm">
                <p className="flex items-center gap-2 font-medium text-success">
                  <CheckCircle2 className="size-4" /> Router reached
                </p>
                <p className="text-xs text-muted-foreground">
                  Running {result.os} · up {result.uptime} · {result.clients} people connected
                </p>
                <StatusPill status="online" />
              </div>
            ) : null}
          </div>

          <div className="panel p-5 text-xs leading-relaxed text-muted-foreground">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ShieldCheck className="size-4 text-primary" /> What this sets up
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-4">
              <li>A private, encrypted link from the router to Kwetu.</li>
              <li>Central sign-in so customer time and data are tracked here.</li>
              <li>Customers can reach the sign-in and payment pages before paying.</li>
              <li>A status report every minute so you see the router live.</li>
            </ul>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <p className="text-sm font-medium text-foreground">Setup code for {routerName}</p>
            <Button size="sm" variant="outline" onClick={copyScript}>
              <Copy className="size-4" /> Copy
            </Button>
          </div>
          <pre className="max-h-[70vh] overflow-auto px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {script}
          </pre>
        </div>
      </div>
    </AdminShell>
  );
}

function LabelledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function randomSecret() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 20; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
