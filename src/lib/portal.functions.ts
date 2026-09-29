import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { TenantConfig } from "@/lib/tenant-config";

function durationLabel(min: number) {
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.round(min / 60)} hour${min >= 120 ? "s" : ""}`;
  const d = Math.round(min / 1440);
  return `${d} day${d > 1 ? "s" : ""}`;
}

export const getPortal = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(80) }).parse(d))
  .handler(async ({ data }): Promise<TenantConfig | null> => {
    const sb = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { data: b } = await sb
      .from("businesses")
      .select("id,slug,name,tagline,headline,support_phone,currency,primary_color,accent_color,terms,logo_url")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!b) return null;
    const { data: plans } = await sb
      .from("plans")
      .select("id,name,price,duration_minutes,data_label,speed_label,popular")
      .eq("business_id", b.id)
      .eq("active", true)
      .order("price");
    return {
      branding: {
        slug: b.slug,
        name: b.name,
        tagline: b.tagline ?? "",
        headline: b.headline ?? "Get online",
        supportPhone: b.support_phone ?? "",
        currency: b.currency,
        primary: b.primary_color,
        accent: b.accent_color,
        logoText: b.name.slice(0, 2).toUpperCase(),
        terms: b.terms ?? "",
      },
      packages: (plans ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        durationLabel: durationLabel(p.duration_minutes),
        dataLabel: p.data_label ?? "Unlimited",
        speedLabel: p.speed_label ?? "",
        popular: p.popular,
      })),
    };
  });
