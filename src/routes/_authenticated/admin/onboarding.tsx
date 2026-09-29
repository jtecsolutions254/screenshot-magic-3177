import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Palette,
  Package,
  Router as RouterIcon,
  Check,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/onboarding")({
  head: () => ({
    meta: [
      { title: "Start a hotspot business — Kwetu Connection" },
      {
        name: "description",
        content:
          "Sign up a hotspot business: profile, branding, internet packages and first router.",
      },
      { property: "og:title", content: "Start a hotspot business — Kwetu Connection" },
      {
        property: "og:description",
        content: "Four quick steps from signup to a live branded hotspot.",
      },
    ],
  }),
  component: OnboardingPage,
});

const steps = [
  { label: "Business", icon: Building2 },
  { label: "Branding", icon: Palette },
  { label: "Packages", icon: Package },
  { label: "First router", icon: RouterIcon },
];

interface PackageDraft {
  id: string;
  name: string;
  price: string;
  duration: string;
  data: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [owner, setOwner] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [currency, setCurrency] = useState("KES");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [primary, setPrimary] = useState("#22d3ee");
  const [accent, setAccent] = useState("#f59e0b");
  const [headline, setHeadline] = useState("Get online in seconds");
  const [terms, setTerms] = useState("Fair usage applies. One device per voucher.");

  const [packages, setPackages] = useState<PackageDraft[]>([
    { id: "1", name: "1 Hour", price: "20", duration: "1 hour", data: "500 MB" },
    { id: "2", name: "24 Hours", price: "100", duration: "24 hours", data: "Unlimited" },
  ]);

  const [routerName, setRouterName] = useState("");
  const [routerLocation, setRouterLocation] = useState("");
  const [routerModel, setRouterModel] = useState("MikroTik hAP ac²");

  const effectiveSlug = slug || slugify(name);
  const canContinue =
    step === 0 ? name.trim().length > 1 && owner.trim().length > 1 : step === 3 ? routerName.trim().length > 1 : true;

  function next() {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setDone(true);
    toast.success(`${name} is ready to go live`);
  }

  if (done) {
    return (
      <AdminShell title="Business created" description="The new hotspot business is set up and ready for its first customers.">
        <div className="panel mx-auto max-w-2xl p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="size-7" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-foreground">{name} is live</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            The sign-in page, {packages.length} packages and the router {routerName} are all set up.
          </p>

          <dl className="mt-6 grid gap-3 text-left sm:grid-cols-2">
            <SummaryRow label="Workspace" value={effectiveSlug} />
            <SummaryRow label="Owner" value={owner} />
            <SummaryRow label="Country" value={`${country} · ${currency}`} />
            <SummaryRow label="First router" value={`${routerName} — ${routerLocation || "not set"}`} />
          </dl>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/portal/$slug" params={{ slug: "kwetunet" }}>
                Preview the customer page
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/router-setup">Set up the router</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/businesses">Back to businesses</Link>
            </Button>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Start a hotspot business"
      description="Four steps: business details, look and feel, what customers can buy, and the first router."
    >
      <div className="mx-auto max-w-3xl">
        <ol className="mb-8 flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <li
              key={s.label}
              className={cn(
                "flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm",
                i === step
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : i < step
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-border text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-4" /> : <s.icon className="size-4" />}
              <span className="whitespace-nowrap font-medium">{s.label}</span>
            </li>
          ))}
        </ol>

        <div className="panel p-6">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Riverside Hotspot"
                />
              </Field>
              <Field label="Web address name" hint={`kwetu.net/portal/${effectiveSlug || "your-name"}`}>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder={slugify(name) || "riverside-hotspot"}
                />
              </Field>
              <Field label="Owner's full name">
                <Input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Full name" />
              </Field>
              <Field label="Country">
                <select
                  value={country}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCountry(c);
                    setCurrency(c === "Tanzania" ? "TZS" : c === "Uganda" ? "UGX" : c === "Rwanda" ? "RWF" : "KES");
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  {["Kenya", "Tanzania", "Uganda", "Rwanda"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Currency">
                <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
              </Field>
              <Field label="Support phone">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7.." />
              </Field>
              <Field label="Support email">
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="help@example.com" />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
              <div className="grid gap-5">
                <Field label="Headline customers see">
                  <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Main colour">
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={primary}
                        onChange={(e) => setPrimary(e.target.value)}
                        className="h-10 w-12 cursor-pointer rounded-md border border-input bg-background"
                      />
                      <Input value={primary} onChange={(e) => setPrimary(e.target.value)} />
                    </div>
                  </Field>
                  <Field label="Highlight colour">
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={accent}
                        onChange={(e) => setAccent(e.target.value)}
                        className="h-10 w-12 cursor-pointer rounded-md border border-input bg-background"
                      />
                      <Input value={accent} onChange={(e) => setAccent(e.target.value)} />
                    </div>
                  </Field>
                </div>
                <Field label="Terms shown at sign-in">
                  <Textarea rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} />
                </Field>
              </div>

              <div className="rounded-xl border border-border p-4" style={{ background: "#0b1220" }}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Preview</p>
                <div className="mt-3 rounded-lg p-4" style={{ background: "#111a2b" }}>
                  <span
                    className="flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-black"
                    style={{ background: primary }}
                  >
                    {(name || "KW").slice(0, 2).toUpperCase()}
                  </span>
                  <p className="mt-3 text-base font-semibold text-white">{name || "Your business"}</p>
                  <p className="text-xs text-white/60">{headline}</p>
                  <div
                    className="mt-4 rounded-md py-2 text-center text-xs font-semibold text-black"
                    style={{ background: accent }}
                  >
                    Buy & connect
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="space-y-3">
                {packages.map((p, idx) => (
                  <div key={p.id} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[1.2fr_0.8fr_1fr_1fr_auto]">
                    <Input
                      value={p.name}
                      placeholder="Name"
                      onChange={(e) =>
                        setPackages(packages.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                      }
                    />
                    <Input
                      value={p.price}
                      placeholder="Price"
                      inputMode="numeric"
                      onChange={(e) =>
                        setPackages(packages.map((x, i) => (i === idx ? { ...x, price: e.target.value } : x)))
                      }
                    />
                    <Input
                      value={p.duration}
                      placeholder="Lasts for"
                      onChange={(e) =>
                        setPackages(packages.map((x, i) => (i === idx ? { ...x, duration: e.target.value } : x)))
                      }
                    />
                    <Input
                      value={p.data}
                      placeholder="Data"
                      onChange={(e) =>
                        setPackages(packages.map((x, i) => (i === idx ? { ...x, data: e.target.value } : x)))
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPackages(packages.filter((_, i) => i !== idx))}
                      aria-label="Remove package"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  setPackages([
                    ...packages,
                    { id: String(Date.now()), name: "", price: "", duration: "", data: "" },
                  ])
                }
              >
                <Plus className="size-4" /> Add package
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Prices are in {currency}. You can change these any time.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Router nickname">
                <Input
                  value={routerName}
                  onChange={(e) => setRouterName(e.target.value)}
                  placeholder="e.g. MAIN-01"
                />
              </Field>
              <Field label="Where it is installed">
                <Input
                  value={routerLocation}
                  onChange={(e) => setRouterLocation(e.target.value)}
                  placeholder="e.g. Nairobi CBD"
                />
              </Field>
              <Field label="Router model">
                <Input value={routerModel} onChange={(e) => setRouterModel(e.target.value)} />
              </Field>
              <div className="sm:col-span-2 rounded-xl border border-primary/25 bg-primary/8 p-4 text-sm text-muted-foreground">
                After finishing you'll get a ready-made setup code to paste into this router so it
                connects to Kwetu and starts letting customers online.
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button onClick={next} disabled={!canContinue}>
              {step === 3 ? "Finish setup" : "Continue"} <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</Label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}
