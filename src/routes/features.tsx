import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Kwetu Connection" },
      { name: "description", content: "Routers, locations, plans, vouchers, payments, sessions, staff and reports for hotspot businesses." },
      { property: "og:title", content: "Features — Kwetu Connection" },
      { property: "og:description", content: "Everything a paid Wi-Fi business needs, in one place." },
    ],
  }),
  component: Features,
});

const groups = [
  { title: "Network", items: ["Multiple locations per business", "MikroTik router setup with one code", "Private secure tunnel for every router", "Online / offline monitoring", "Live sessions and data use"] },
  { title: "Selling", items: ["Internet plans by time, data and speed", "Branded customer Wi-Fi page", "Voucher codes for cash sales", "M-Pesa, Paystack and Flutterwave", "Automatic login after payment"] },
  { title: "Running the business", items: ["Revenue today and this month", "Subscriber list", "Staff accounts with roles", "Payment history", "Reports per location"] },
];

function Features() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold">Features</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          One platform for every hotspot business — each with its own private data, brand and customers.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="panel p-6">
              <p className="font-display text-lg font-semibold text-primary">{g.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {g.items.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
