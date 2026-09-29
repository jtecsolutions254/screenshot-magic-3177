import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Business = Database["public"]["Tables"]["businesses"]["Row"];
export type TenantTable =
  | "locations"
  | "routers"
  | "plans"
  | "vouchers"
  | "subscribers"
  | "payments"
  | "sessions"
  | "staff"
  | "gateway_settings";

export async function fetchMyBusiness(): Promise<Business | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", u.user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();
  return data;
}

export function useMyBusiness() {
  return useQuery({ queryKey: ["my-business"], queryFn: fetchMyBusiness });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTenantRows<T = any>(table: TenantTable, businessId?: string) {
  return useQuery({
    queryKey: ["tenant", table, businessId],
    enabled: !!businessId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("business_id", businessId!);
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useInvalidateTenant() {
  const qc = useQueryClient();
  return (table?: TenantTable) =>
    qc.invalidateQueries({ queryKey: table ? ["tenant", table] : ["tenant"] });
}

export function money(business: Pick<Business, "currency"> | null | undefined, n: number) {
  return `${business?.currency ?? "KES"} ${Math.round(n).toLocaleString()}`;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
