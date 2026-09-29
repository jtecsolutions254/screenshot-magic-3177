import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wifi, Ticket, Smartphone, Clock, Gauge, ShieldCheck, Loader2, Check } from "lucide-react";
import { getTenantConfig, type HotspotPackage } from "@/lib/tenant-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/$slug")({
  loader: ({ params }) => {
    const config = getTenantConfig(params.slug);
    if (!config) throw notFound();
    return config;
  },
  head: ({ loaderData }) => {
    const name = loaderData?.branding.name ?? "Hotspot";
    return {
      meta: [
        { title: `${name} WiFi — buy a package and connect` },
        {
          name: "description",
          content: `Choose a ${name} internet package, pay from your phone and get online instantly.`,
        },
        { property: "og:title", content: `${name} WiFi` },
        { property: "og:description", content: `Buy a package and get online with ${name}.` },
      ],
    };
  },
  component: PortalPage,
});

type Mode = "buy" | "voucher";
type Stage = "idle" | "prompting" | "connected";

function PortalPage() {
  const { branding, packages } = Route.useLoaderData();
  const [mode, setMode] = useState<Mode>("buy");
  const [selected, setSelected] = useState<HotspotPackage>(packages[1] ?? packages[0]);
  const [phone, setPhone] = useState("");
  const [voucher, setVoucher] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (stage !== "connected") return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  function pay() {
    if (phone.trim().length < 9) {
      toast.error("Enter the phone number to pay from");
      return;
    }
    setStage("prompting");
    setTimeout(() => {
      setStage("connected");
      setRemaining(3600);
      toast.success("Payment received — you are online");
    }, 2600);
  }

  function redeem() {
    if (voucher.trim().length < 4) {
      toast.error("Enter the code from your voucher");
      return;
    }
    setStage("connected");
    setRemaining(3600);
    toast.success("Voucher accepted — you are online");
  }

  const style = {
    "--brand": branding.primary,
    "--brand-accent": branding.accent,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-[#0a1020] px-4 py-10 text-white" style={style}>
      <div className="mx-auto w-full max-w-md">
        <header className="flex items-center gap-3">
          <span
            className="flex size-11 items-center justify-center rounded-xl text-base font-bold text-black"
            style={{ background: branding.primary }}
          >
            {branding.logoText}
          </span>
          <div>
            <p className="font-display text-lg font-semibold">{branding.name}</p>
            <p className="text-xs text-white/55">{branding.tagline}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">
            <Wifi className="size-3.5" /> Hotspot
          </span>
        </header>

        {stage === "connected" ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
            <span
              className="mx-auto flex size-14 items-center justify-center rounded-full text-black"
              style={{ background: branding.primary }}
            >
              <Check className="size-7" />
            </span>
            <h1 className="mt-4 font-display text-xl font-semibold">You're connected</h1>
            <p className="mt-1 text-sm text-white/60">{selected.name} · {selected.speedLabel}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              <Tile icon={Clock} label="Time left" value={formatTime(remaining)} />
              <Tile icon={Gauge} label="Data" value={selected.dataLabel} />
            </div>

            <Button
              variant="outline"
              className="mt-6 w-full border-white/20 bg-transparent text-white hover:bg-white/10"
              onClick={() => {
                setStage("idle");
                toast("You have been disconnected");
              }}
            >
              Disconnect
            </Button>
          </section>
        ) : (
          <section className="mt-8">
            <h1 className="font-display text-2xl font-semibold">{branding.headline}</h1>
            <p className="mt-1 text-sm text-white/60">
              Pick a package and pay from your phone, or use a voucher code.
            </p>

            <div className="mt-5 flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
              {(
                [
                  ["buy", "Buy & connect", Smartphone],
                  ["voucher", "Voucher code", Ticket],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition",
                    mode === value ? "text-black" : "text-white/60 hover:text-white",
                  )}
                  style={mode === value ? { background: branding.primary } : undefined}
                >
                  <Icon className="size-4" /> {label}
                </button>
              ))}
            </div>

            {mode === "buy" ? (
              <div className="mt-5 space-y-3">
                {packages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-4 text-left transition",
                      selected.id === p.id
                        ? "bg-white/[0.07]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                    )}
                    style={selected.id === p.id ? { borderColor: branding.primary } : undefined}
                  >
                    <div>
                      <p className="font-semibold">
                        {p.name}
                        {p.popular ? (
                          <span
                            className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-black"
                            style={{ background: branding.accent }}
                          >
                            POPULAR
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-white/55">
                        {p.durationLabel} · {p.dataLabel} · up to {p.speedLabel}
                      </p>
                    </div>
                    <p className="stat-value text-lg" style={{ color: branding.primary }}>
                      {branding.currency} {p.price.toLocaleString()}
                    </p>
                  </button>
                ))}

                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number to pay from"
                  inputMode="tel"
                  className="mt-4 h-12 border-white/15 bg-white/[0.04] text-white placeholder:text-white/40"
                />

                <Button
                  onClick={pay}
                  disabled={stage === "prompting"}
                  className="h-12 w-full text-base font-semibold text-black hover:opacity-90"
                  style={{ background: branding.accent }}
                >
                  {stage === "prompting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Check your phone…
                    </>
                  ) : (
                    <>
                      Pay {branding.currency} {selected.price.toLocaleString()} & connect
                    </>
                  )}
                </Button>
                {stage === "prompting" ? (
                  <p className="text-center text-xs text-white/55">
                    A payment request was sent to {phone}. Enter your PIN to approve.
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <Input
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value.toUpperCase())}
                  placeholder="Enter voucher code"
                  className="h-12 border-white/15 bg-white/[0.04] text-center font-mono text-lg tracking-[0.3em] text-white placeholder:tracking-normal placeholder:font-sans placeholder:text-white/40"
                />
                <Button
                  onClick={redeem}
                  className="h-12 w-full text-base font-semibold text-black hover:opacity-90"
                  style={{ background: branding.primary }}
                >
                  Connect
                </Button>
              </div>
            )}
          </section>
        )}

        <footer className="mt-8 space-y-2 text-center text-[11px] text-white/45">
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> {branding.terms}
          </p>
          <p>Need help? Call {branding.supportPhone}</p>
          <p>
            <Link to="/" className="underline-offset-2 hover:underline">
              Powered by Kwetu Connection
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-white/50">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="stat-value mt-1 text-lg">{value}</p>
    </div>
  );
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}
