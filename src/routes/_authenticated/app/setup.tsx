import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Loader2, PlugZap, Rocket, Trash2 } from "lucide-react";
import { OwnerShell } from "@/components/owner-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  money,
  slugify,
  durationText,
  useInvalidateTenant,
  useMyBusiness,
  useTenantRows,
  type Business,
} from "@/lib/business";
import {
  BizFieldsGrid,
  PortalPreview,
  brandingFields,
  profileFields,
  saveBusiness,
  useBizForm,
} from "@/components/business-fields";
import { randomSecret, routerScriptFor, testRouter } from "@/lib/router-tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/setup")({
  head: () => ({ meta: [{ title: "Set up your hotspot — Kwetu Connection" }] }),
  component: SetupPage,
});

const steps = [
  "Create account",
  "Business details",
  "First location",
  "Branding",
  "Internet plans",
  "Connect router",
  "Test router",
  "Test customer page",
  "Publish",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function SetupPage() {
  const { data: business, isLoading } = useMyBusiness();
  const qc = useQueryClient();
  const [override, setOverride] = useState<number | null>(null);
  const current = override ?? (business ? Math.min(Math.max(business.setup_step, 2), 9) : 2);

  async function goto(step: number) {
    setOverride(step);
    if (business && step > business.setup_step) {
      await saveBusiness(business.id, { setup_step: step });
      qc.invalidateQueries({ queryKey: ["my-business"] });
    }
  }

  return (
    <OwnerShell title="Set up your hotspot" description="Nine short steps from sign-up to selling Wi-Fi.">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <ol className="panel h-fit space-y-1 p-3">
          {steps.map((s, i) => {
            const n = i + 1;
            const done = n === 1 || (business && n < (business.setup_step ?? 1));
            const reachable = n === 1 || n === 2 || (business && n <= business.setup_step);
            return (
              <li key={s}>
                <button
                  disabled={!reachable || n === 1}
                  onClick={() => setOverride(n)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
                    current === n ? "bg-primary/15 text-primary" : "text-muted-foreground",
                    reachable && n !== 1 && "hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                      done ? "border-success bg-success/15 text-success" : "border-border",
                    )}
                  >
                    {done ? <Check className="size-3.5" /> : n}
                  </span>
                  {s}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="panel p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">
            Step {current} of 9
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">{steps[current - 1]}</h2>
          <div className="mt-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : current === 2 || !business ? (
              <BusinessStep business={business ?? null} onDone={() => goto(3)} />
            ) : current === 3 ? (
              <LocationStep business={business} onDone={() => goto(4)} />
            ) : current === 4 ? (
              <BrandingStep business={business} onDone={() => goto(5)} />
            ) : current === 5 ? (
              <PlansStep business={business} onDone={() => goto(6)} />
            ) : current === 6 ? (
              <RouterStep business={business} onDone={() => goto(7)} />
            ) : current === 7 ? (
              <TestRouterStep business={business} onDone={() => goto(8)} />
            ) : current === 8 ? (
              <TestPortalStep business={business} onDone={() => goto(9)} />
            ) : (
              <PublishStep business={business} />
            )}
          </div>
        </div>
      </div>
    </OwnerShell>
  );
}

function BusinessStep({ business, onDone }: { business: Business | null; onDone: () => void }) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      profileFields.map((f) => [f.key, String(business?.[f.key] ?? (f.key === "currency" ? "KES" : f.key === "country" ? "Kenya" : ""))]),
    ),
  );
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!values.name?.trim()) return toast.error("Business name is required");
    setBusy(true);
    if (business) {
      const ok = await saveBusiness(business.id, values);
      setBusy(false);
      if (ok) onDone();
      return;
    }
    const { data: u } = await supabase.auth.getUser();
    const base = slugify(values.name) || "hotspot";
    let slug = base;
    for (let i = 0; i < 5; i++) {
      const { error } = await supabase.from("businesses").insert({
        ...Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v || null])),
        name: values.name.trim(),
        currency: values.currency || "KES",
        owner_id: u.user!.id,
        slug,
        setup_step: 3,
        support_phone: values.phone || null,
        support_email: values.email || null,
      });
      if (!error) {
        setBusy(false);
        await qc.invalidateQueries({ queryKey: ["my-business"] });
        toast.success("Business created");
        onDone();
        return;
      }
      if (!error.message.includes("duplicate")) {
        setBusy(false);
        return toast.error(error.message);
      }
      slug = `${base}-${Math.floor(Math.random() * 900 + 100)}`;
    }
    setBusy(false);
    toast.error("Could not pick a unique address, try another name");
  }

  return (
    <div className="space-y-5">
      <BizFieldsGrid fields={profileFields} values={values} onChange={setValues} />
      <Button onClick={submit} disabled={busy}>
        {busy ? "Saving…" : "Save and continue"}
      </Button>
    </div>
  );
}

function LocationStep({ business, onDone }: { business: Business; onDone: () => void }) {
  const { data: locs = [] } = useTenantRows<Row>("locations", business.id);
  const invalidate = useInvalidateTenant();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  async function add() {
    if (!name.trim()) return toast.error("Give the location a name");
    const { error } = await supabase
      .from("locations")
      .insert({ business_id: business.id, name: name.trim(), address: address || null });
    if (error) return toast.error(error.message);
    setName("");
    setAddress("");
    invalidate("locations");
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Where is your Wi-Fi? For example "CBD" or "Westlands".</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <Input placeholder="Location name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Button variant="secondary" onClick={add}>Add</Button>
      </div>
      <ul className="space-y-2">
        {locs.map((l) => (
          <li key={l.id} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground">
            {business.name} → <span className="font-medium">{l.name}</span>
          </li>
        ))}
      </ul>
      <Button onClick={() => (locs.length ? onDone() : toast.error("Add at least one location"))}>
        Continue
      </Button>
    </div>
  );
}

function BrandingStep({ business, onDone }: { business: Business; onDone: () => void }) {
  const { values, setValues } = useBizForm(business, brandingFields);
  const qc = useQueryClient();
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="space-y-5">
        <BizFieldsGrid fields={brandingFields} values={values} onChange={setValues} />
        <Button
          onClick={async () => {
            if (await saveBusiness(business.id, values)) {
              qc.invalidateQueries({ queryKey: ["my-business"] });
              onDone();
            }
          }}
        >
          Save and continue
        </Button>
      </div>
      <PortalPreview values={values} />
    </div>
  );
}

const starterPlans = [
  { name: "1 Hour", price: 50, duration_minutes: 60, data_label: "500 MB", speed_label: "5 Mbps" },
  { name: "6 Hours", price: 150, duration_minutes: 360, data_label: "2 GB", speed_label: "8 Mbps", popular: true },
  { name: "24 Hours", price: 300, duration_minutes: 1440, data_label: "Unlimited", speed_label: "10 Mbps" },
];

function PlansStep({ business, onDone }: { business: Business; onDone: () => void }) {
  const { data: plans = [] } = useTenantRows<Row>("plans", business.id);
  const invalidate = useInvalidateTenant();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [minutes, setMinutes] = useState("60");

  async function insert(rows: Row[]) {
    const { error } = await supabase.from("plans").insert(rows.map((r) => ({ ...r, business_id: business.id })) as never);
    if (error) return toast.error(error.message);
    invalidate("plans");
  }

  return (
    <div className="space-y-5">
      {plans.length === 0 && (
        <Button variant="outline" onClick={() => insert(starterPlans)}>
          Use starter plans (1 hour, 6 hours, 24 hours)
        </Button>
      )}
      <div className="grid gap-3 sm:grid-cols-[1fr_120px_140px_auto]">
        <Input placeholder="Plan name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder={`Price ${business.currency}`} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input placeholder="Minutes" type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        <Button
          variant="secondary"
          onClick={() => {
            if (!name || !price) return toast.error("Name and price are required");
            insert([{ name, price: Number(price), duration_minutes: Number(minutes) || 60 }]);
            setName("");
            setPrice("");
          }}
        >
          Add
        </Button>
      </div>
      <ul className="space-y-2">
        {plans.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm text-foreground">
            <span>
              {p.name} · {durationText(p.duration_minutes)} · {money(business, Number(p.price))}
            </span>
            <button
              onClick={async () => {
                await supabase.from("plans").delete().eq("id", p.id);
                invalidate("plans");
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <Button onClick={() => (plans.length ? onDone() : toast.error("Add at least one plan"))}>Continue</Button>
    </div>
  );
}

function RouterStep({ business, onDone }: { business: Business; onDone: () => void }) {
  const { data: routers = [] } = useTenantRows<Row>("routers", business.id);
  const { data: locs = [] } = useTenantRows<Row>("locations", business.id);
  const invalidate = useInvalidateTenant();
  const [name, setName] = useState("");
  const router = routers[0];

  async function add() {
    if (!name.trim()) return toast.error("Give the router a name");
    const { error } = await supabase.from("routers").insert({
      business_id: business.id,
      location_id: locs[0]?.id ?? null,
      name: name.trim(),
      tunnel_ip: `10.77.${Math.floor(Math.random() * 250) + 1}.2`,
      radius_secret: randomSecret(),
    });
    if (error) return toast.error(error.message);
    invalidate("routers");
  }

  if (!router)
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Name your MikroTik router. We'll create the setup code to paste into it once.
        </p>
        <div className="flex gap-3">
          <Input placeholder="e.g. CBD-Main" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={add}>Create</Button>
        </div>
      </div>
    );

  const script = routerScriptFor(business, router);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Open the router's terminal (Winbox → New Terminal) and paste this code. It sets up a private secure
        tunnel to Kwetu, central sign-in and your hotspot.
      </p>
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(script);
            toast.success("Copied");
          }}
        >
          <Copy className="size-4" /> Copy code
        </Button>
      </div>
      <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-3 font-mono text-[11px] text-foreground">{script}</pre>
      <Button onClick={onDone}>I've pasted it — continue</Button>
    </div>
  );
}

function TestRouterStep({ business, onDone }: { business: Business; onDone: () => void }) {
  const { data: routers = [] } = useTenantRows<Row>("routers", business.id);
  const invalidate = useInvalidateTenant();
  const [busy, setBusy] = useState(false);
  const router = routers[0];
  if (!router) return <p className="text-sm text-muted-foreground">Add a router in the previous step first.</p>;
  const online = router.status === "online";
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        We'll ask <span className="font-medium text-foreground">{router.name}</span> to answer through the tunnel.
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const ok = await testRouter(router.id);
            setBusy(false);
            invalidate("routers");
            if (ok) toast.success("Router is online");
          }}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <PlugZap className="size-4" />} Test connection
        </Button>
        {online && <Button onClick={onDone}>Continue</Button>}
      </div>
      {online && <p className="text-sm text-success">Connected · RouterOS {router.routeros_version}</p>}
    </div>
  );
}

function TestPortalStep({ business, onDone }: { business: Business; onDone: () => void }) {
  const { values } = useBizForm(business, brandingFields);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>This is how your page looks to someone joining your Wi-Fi. Check the name, colours and support number.</p>
        <p>Want changes? Go back to Branding or Internet plans from the list on the left.</p>
        <Button onClick={onDone}>Looks good — continue</Button>
      </div>
      <PortalPreview values={values} />
    </div>
  );
}

function PublishStep({ business }: { business: Business }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  if (business.published)
    return (
      <div className="space-y-4">
        <p className="text-sm text-success">Your hotspot is live.</p>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/portal/$slug" params={{ slug: business.slug }}>Open customer page</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Publishing makes your customer page live at <span className="font-mono">/portal/{business.slug}</span>.
      </p>
      <Button
        onClick={async () => {
          if (await saveBusiness(business.id, { published: true, setup_step: 10, status: "active" })) {
            await qc.invalidateQueries({ queryKey: ["my-business"] });
            toast.success("Hotspot published!");
            navigate({ to: "/app" });
          }
        }}
      >
        <Rocket className="size-4" /> Publish hotspot
      </Button>
    </div>
  );
}
