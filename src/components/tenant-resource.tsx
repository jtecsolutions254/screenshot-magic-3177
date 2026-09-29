import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useInvalidateTenant, useTenantRows, type TenantTable } from "@/lib/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Field {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "checkbox";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  default?: string | number | boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export interface Column {
  label: string;
  render: (row: Row) => ReactNode;
}

export function TenantResource({
  table,
  businessId,
  fields,
  columns,
  addLabel,
  emptyText,
  canAdd = true,
  sort,
  transform,
}: {
  table: TenantTable;
  businessId: string;
  fields: Field[];
  columns: Column[];
  addLabel: string;
  emptyText: string;
  canAdd?: boolean;
  sort?: (a: Row, b: Row) => number;
  transform?: (values: Row) => Row;
}) {
  const { data, isLoading } = useTenantRows<Row>(table, businessId);
  const invalidate = useInvalidateTenant();
  const initial = () =>
    Object.fromEntries(fields.map((f) => [f.key, f.default ?? (f.type === "checkbox" ? false : "")]));
  const [values, setValues] = useState<Row>(initial);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && (values[f.key] === "" || values[f.key] == null)) {
        toast.error(`${f.label} is required`);
        return;
      }
    }
    setSaving(true);
    const clean: Row = {};
    for (const f of fields) {
      const v = values[f.key];
      clean[f.key] = f.type === "number" ? Number(v) : v === "" ? null : v;
    }
    const payload = { ...(transform ? transform(clean) : clean), business_id: businessId };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from(table).insert(payload as any);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setValues(initial());
    setOpen(false);
    invalidate(table);
  }

  async function remove(id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    invalidate(table);
  }

  const rows = [...(data ?? [])].sort(sort ?? ((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""))));

  return (
    <div className="space-y-5">
      {canAdd && (
        <div className="panel p-5">
          {!open ? (
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" /> {addLabel}
            </Button>
          ) : (
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.type === "select" ? (
                    <select
                      id={f.key}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">Choose…</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "checkbox" ? (
                    <input
                      id={f.key}
                      type="checkbox"
                      checked={!!values[f.key]}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.checked })}
                      className="mt-2 size-4"
                    />
                  ) : (
                    <Input
                      id={f.key}
                      type={f.type === "number" ? "number" : "text"}
                      placeholder={f.placeholder}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => (
                <th key={c.label} className="px-4 py-3 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  {columns.map((c) => (
                    <td key={c.label} className="px-4 py-3 text-foreground">
                      {c.render(r)}
                    </td>
                  ))}
                  <td className="px-2">
                    <button
                      onClick={() => remove(r.id)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
