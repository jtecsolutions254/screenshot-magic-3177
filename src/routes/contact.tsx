import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kwetu Connection" },
      { name: "description", content: "Talk to the Kwetu Connection team about launching your Wi-Fi business." },
      { property: "og:title", content: "Contact — Kwetu Connection" },
      { property: "og:description", content: "Get in touch with Kwetu Connection Internet Services." },
    ],
  }),
  component: () => (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold">Contact us</h1>
        <p className="mt-3 text-muted-foreground">We help you get your first router online.</p>
        <div className="panel mt-10 grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
            <p className="mt-1 text-foreground">hello@kwetuconnection.com</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Phone / WhatsApp</p>
            <p className="mt-1 text-foreground">+254 700 000 000</p>
          </div>
        </div>
      </section>
    </SiteShell>
  ),
});
