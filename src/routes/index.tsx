import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Router as RouterIcon,
  Smartphone,
  Ticket,
  BarChart3,
  Palette,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { SiteShell } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kwetu Connection — Powering Smarter Wi-Fi Businesses" },
      {
        name: "description",
        content:
          "Launch and run your paid Wi-Fi hotspot business: MikroTik routers, branded customer page, M-Pesa payments, vouchers and reports.",
      },
      { property: "og:title", content: "Kwetu Connection — Powering Smarter Wi-Fi Businesses" },
      {
        property: "og:description",
        content: "Everything you need to sell Wi-Fi: routers, payments, vouchers and a branded customer page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const steps = [
  { n: "01", title: "Create your account", body: "Sign up and name your hotspot business in minutes." },
  { n: "02", title: "Paste one setup code", body: "Connect your MikroTik router with a single copy-paste." },
  { n: "03", title: "Start selling Wi-Fi", body: "Customers pick a package, pay by phone and get online." },
];

const features = [
  { icon: Smartphone, title: "Mobile money built in", body: "M-Pesa, Paystack and Flutterwave. Switch any time." },
  { icon: Palette, title: "Your brand, your page", body: "Your logo, colours and packages on the Wi-Fi sign-in page." },
  { icon: RouterIcon, title: "Router monitoring", body: "See which routers are online and who's connected." },
  { icon: Ticket, title: "Vouchers", body: "Print codes to sell for cash at the counter." },
  { icon: BarChart3, title: "Revenue reports", body: "Daily and monthly takings per location." },
  { icon: ShieldCheck, title: "Private & secure", body: "Routers connect through a private tunnel, never exposed." },
];

function Home() {
  return (
    <SiteShell>
      <section className="grid-backdrop border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Hotspot business platform
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
              Powering smarter
              <br />
              <span className="text-primary">Wi-Fi businesses.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Kwetu Connection gives you everything to run paid Wi-Fi: connect your routers, set your
              prices, take mobile money and watch your revenue — from one dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/signup">
                  Start your hotspot business <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">14-day free trial · No card needed</p>
          </div>
          <div className="panel p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Today at your hotspot</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Revenue", "KES 12,450"],
                ["Online now", "87"],
                ["Routers", "4 / 4"],
                ["Vouchers sold", "132"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="stat-value mt-1 text-2xl font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">Illustration</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold">Live in three steps</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="panel p-6">
              <p className="font-mono text-sm text-primary">{s.n}</p>
              <p className="mt-3 font-display text-lg font-semibold">{s.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold">Built for hotspot operators</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}>
                <f.icon className="size-6 text-primary" />
                <p className="mt-3 font-medium">{f.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold">Ready to sell Wi-Fi?</h2>
        <p className="mt-3 text-muted-foreground">Set up your business, router and prices today.</p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/signup">Create free account</Link>
        </Button>
      </section>
    </SiteShell>
  );
}
