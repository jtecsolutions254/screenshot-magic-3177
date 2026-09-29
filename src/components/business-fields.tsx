import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Business } from "@/lib/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type BizKey = keyof Business;
export interface BizField {
  key: BizKey;
  label: string;
  type?: "text" | "color" | "textarea";
  placeholder?: string;
}

export const brandingFields: BizField[] = [
  { key: "name", label: "Business name" },
  { key: "tagline", label: "Tagline", placeholder: "Fast neighbourhood WiFi" },
  { key: "headline", label: "Welcome headline", placeholder: "Get online in seconds" },
  { key: "logo_url", label: "Logo link (optional)", placeholder: "https://…/logo.png" },
  { key: "primary_color", label: "Primary colour", type: "color" },
  { key: "accent_color", label: "Secondary colour", type: "color" },
  { key: "portal_background", label: "Page background", type: "color" },
  { key: "support_phone", label: "Support phone" },
  { key: "support_email", label: "Support email" },
  { key: "terms", label: "Terms shown to customers", type: "textarea" },
];

export const profileFields: BizField[] = [
  { key: "name", label: "Business name" },
  { key: "owner_name", label: "Owner name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "country", label: "Country" },
  { key: "currency", label: "Currency (e.g. KES, TZS, UGX)" },
];

export function useBizForm(business: Business, fields: BizField[]) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, String(business[f.key] ?? "")])),
  );
  return { values, setValues };
}

export function BizFieldsGrid({
  fields,
  values,
  onChange,
}: {
  fields: BizField[];
  values: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.type === "textarea" ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
          <Label htmlFor={f.key}>{f.label}</Label>
          {f.type === "color" ? (
            <div className="flex gap-2">
              <input
                type="color"
                value={values[f.key] || "#22d3ee"}
                onChange={(e) => onChange({ ...values, [f.key]: e.target.value })}
                className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent"
              />
              <Input
                id={f.key}
                value={values[f.key] ?? ""}
                onChange={(e) => onChange({ ...values, [f.key]: e.target.value })}
              />
            </div>
          ) : f.type === "textarea" ? (
            <textarea
              id={f.key}
              value={values[f.key] ?? ""}
              onChange={(e) => onChange({ ...values, [f.key]: e.target.value })}
              className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          ) : (
            <Input
              id={f.key}
              placeholder={f.placeholder}
              value={values[f.key] ?? ""}
              onChange={(e) => onChange({ ...values, [f.key]: e.target.value })}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export async function saveBusiness(id: string, patch: Record<string, unknown>) {
  const clean = Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, v === "" ? null : v]));
  const { error } = await supabase.from("businesses").update(clean as never).eq("id", id);
  if (error) {
    toast.error(error.message);
    return false;
  }
  return true;
}

export function BusinessEditor({ business, fields }: { business: Business; fields: BizField[] }) {
  const { values, setValues } = useBizForm(business, fields);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <div className="panel space-y-5 p-6">
      <BizFieldsGrid fields={fields} values={values} onChange={setValues} />
      <Button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const ok = await saveBusiness(business.id, values);
          setBusy(false);
          if (ok) {
            toast.success("Saved");
            qc.invalidateQueries({ queryKey: ["my-business"] });
          }
        }}
      >
        {busy ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

export function PortalPreview({ values }: { values: Partial<Record<BizKey, string>> }) {
  const primary = values.primary_color || "#22d3ee";
  return (
    <div
      className="rounded-2xl border border-border p-5"
      style={{ background: values.portal_background || "#0a1020", color: "#fff" }}
    >
      <div className="flex items-center gap-3">
        {values.logo_url ? (
          <img src={values.logo_url} alt="" className="size-10 rounded-lg object-cover" />
        ) : (
          <span
            className="flex size-10 items-center justify-center rounded-lg text-sm font-bold"
            style={{ background: primary, color: "#000" }}
          >
            {(values.name || "WiFi").slice(0, 2).toUpperCase()}
          </span>
        )}
        <div>
          <p className="font-display font-semibold">{values.name || "Your business"}</p>
          <p className="text-xs opacity-60">{values.tagline}</p>
        </div>
      </div>
      <p className="mt-5 font-display text-xl font-semibold">{values.headline || "Get online"}</p>
      <div className="mt-4 space-y-2">
        {["1 Hour", "24 Hours"].map((p) => (
          <div key={p} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: primary + "66" }}>
            {p}
          </div>
        ))}
      </div>
      <div
        className="mt-4 rounded-lg py-2 text-center text-sm font-semibold"
        style={{ background: primary, color: "#000" }}
      >
        Pay & connect
      </div>
      <p className="mt-3 text-center text-[11px]" style={{ color: values.accent_color }}>
        Help: {values.support_phone || "—"}
      </p>
    </div>
  );
}
