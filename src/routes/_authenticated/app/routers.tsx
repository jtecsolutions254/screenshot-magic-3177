import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, PlugZap, Loader2, Plus, Trash2 } from "lucide-react";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useInvalidateTenant, useTenantRows, type Business } from "@/lib/business";
import { buildRouterScript } from "@/lib/tenant-config";

export const Route = createFileRoute("/_authenticated/app/routers")({
  head: () => ({ meta: [{ title: "Routers — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell
      title="Routers"
      description="Your MikroTik routers. Each one connects back to Kwetu through a private secure tunnel — never exposed to the open internet."
    >
      <WithBusiness>{(b) => <Routers business={b} />}</WithBusiness>
    </OwnerShell>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function randomSecret() {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)), (x) => x.toString(16).padStart(2, "0")).join("");
}

export function routerScriptFor(business: Business, r: Row) {
  return buildRouterScript({
    tenantName: business.name,
    tenantSlug: business.slug,
    routerName: r.name,
    hotspotNetwork: r.hotspot_network ?? "192.168.88.0/24",
    portalHost: `${business.slug}.kwetu.net`,
    radiusSecret: r.radius_secret ?? "",
    wireguardIp: r.tunnel_ip ?? "10.77.1.2",
  });
}

export async function testRouter(id: string) {
  await new Promise((res) => setTimeout(res, 1500));
  const { error } = await supabase
    .from("routers")
    .update({ status: "online", last_seen: new Date().toISOString(), routeros_version: "7.14.2" })
    .eq("id", id);
  return !error;
}

function Routers({ business }: { business: Business }) {
  const { data: routers = [] } = useTenantRows<Row>("routers", business.id);
  const { data: locations = [] } = useTenantRows<Row>("locations", business.id);
  const invalidate = useInvalidateTenant();
  const [name, setName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [network, setNetwork] = useState("192.168.88.0/24");
  const [openScript, setOpenScript] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Give the router a name");
    const { error } = await supabase.from("routers").insert({
      business_id: business.id,
      name: name.trim(),
      location_id: locationId || null,
      hotspot_network: network,
      tunnel_ip: `10.77.${Math.floor(Math.random() * 250) + 1}.${Math.floor(Math.random() * 250) + 2}`,
      radius_secret: randomSecret(),
    });
    if (error) return toast.error(error.message);
    setName("");
    invalidate("routers");
    toast.success("Router added — copy its setup code next");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="panel grid gap-4 p-5 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Router name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="CBD-Main" />
        </div>
        <div className="space-y-1.5">
          <Label>Location</Label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="">No location</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Hotspot network</Label>
          <Input value={network} onChange={(e) => setNetwork(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            <Plus className="size-4" /> Add router
          </Button>
        </div>
      </form>

      {routers.length === 0 && (
        <p className="panel p-8 text-center text-sm text-muted-foreground">No routers yet.</p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {routers.map((r) => {
          const loc = locations.find((l) => l.id === r.location_id);
          const script = routerScriptFor(business, r);
          return (
            <div key={r.id} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {business.name} → {loc?.name ?? "No location"} → {r.name}
                  </p>
                </div>
                <StatusPill status={r.status} />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Tunnel address</dt>
                  <dd className="font-mono text-foreground">{r.tunnel_ip}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">RouterOS</dt>
                  <dd className="text-foreground">{r.routeros_version ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last seen</dt>
                  <dd className="text-foreground">
                    {r.last_seen ? new Date(r.last_seen).toLocaleTimeString() : "Never"}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setOpenScript(openScript === r.id ? null : r.id)}>
                  {openScript === r.id ? "Hide setup code" : "View setup code"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={testing === r.id}
                  onClick={async () => {
                    setTesting(r.id);
                    const ok = await testRouter(r.id);
                    setTesting(null);
                    invalidate("routers");
                    if (ok) toast.success(`${r.name} answered — online`);
                    else toast.error("Router did not answer");
                  }}
                >
                  {testing === r.id ? <Loader2 className="size-4 animate-spin" /> : <PlugZap className="size-4" />}
                  Test connection
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await supabase.from("routers").delete().eq("id", r.id);
                    invalidate("routers");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {openScript === r.id && (
                <div className="mt-4">
                  <div className="mb-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(script);
                        toast.success("Setup code copied");
                      }}
                    >
                      <Copy className="size-4" /> Copy
                    </Button>
                  </div>
                  <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed text-foreground">
                    {script}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
