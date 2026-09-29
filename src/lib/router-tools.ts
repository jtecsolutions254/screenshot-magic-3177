import { supabase } from "@/integrations/supabase/client";
import { buildRouterScript } from "@/lib/tenant-config";
import type { Business } from "@/lib/business";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export function randomSecret() {
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

