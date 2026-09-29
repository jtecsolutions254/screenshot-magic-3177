import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Signal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

function useSignedIn() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);
  return signedIn;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const signedIn = useSignedIn();
  const links = [
    { to: "/features", label: "Features" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ] as const;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Signal className="size-4" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-sm font-bold tracking-wide">KWETU CONNECTION</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Internet Services
              </span>
            </span>
          </Link>
          <nav className="ml-auto hidden gap-6 text-sm md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex gap-2 md:ml-0">
            {signedIn ? (
              <Button asChild size="sm">
                <Link to="/app">My dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Start free trial</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Kwetu Connection Internet Services · Powering Smarter Wi-Fi Businesses.</p>
          <div className="flex gap-5">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
