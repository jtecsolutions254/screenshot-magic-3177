import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Kwetu Connection" },
      { name: "description", content: "Simple monthly plans for hotspot businesses. 14-day free trial." },
      { property: "og:title", content: "Pricing — Kwetu Connection" },
      { property: "og:description", content: "Starter, Growth and Pro plans for Wi-Fi hotspot businesses." },
    ],
  }),
  component: Pricing,
});

const plans = [
  { name: "Starter", price: "KES 1,500", items: ["1 location", "2 routers", "500 subscribers", "M-Pesa payments"] },
  { name: "Growth", price: "KES 4,000", popular: true, items: ["5 locations", "10 routers", "5,000 subscribers", "All payment providers", "Staff accounts"] },
  { name: "Pro", price: "KES 9,500", items: ["Unlimited locations", "50 routers", "Unlimited subscribers", "Priority support", "Custom domain"] },
];

function Pricing() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold">Pricing</h1>
        <p className="mt-3 text-muted-foreground">Every plan starts with a 14-day free trial. Sample prices.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={cn("panel flex flex-col p-6", p.popular && "ring-1 ring-primary")}>
              <p className="font-display text-lg font-semibold">{p.name}</p>
              <p className="mt-3">
                <span className="stat-value text-3xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground"> / month</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="size-4 text-primary" /> {i}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6" variant={p.popular ? "default" : "outline"}>
                <Link to="/signup">Start free trial</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
