import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteShell } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function homeFor(userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" });
  return data ? "/admin" : "/app";
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const go = async (id: string) => navigate({ to: await homeFor(id), replace: true });
    supabase.auth.getSession().then(({ data }) => data.session && go(data.session.user.id));
    const { data } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === "SIGNED_IN" && s) go(s.user.id);
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      if (!data.session) toast.success("Check your email to confirm your account, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/login" });
    if (r.error) toast.error("Google sign-in failed");
  }

  return (
    <SiteShell>
      <section className="mx-auto flex max-w-md flex-col px-6 py-20">
        <h1 className="font-display text-3xl font-bold">
          {mode === "signup" ? "Start your hotspot business" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Create your Kwetu Connection account. 14-day free trial."
            : "Sign in to manage your Wi-Fi business."}
        </p>
        <div className="panel mt-8 space-y-5 p-6">
          <Button variant="outline" className="w-full" onClick={google}>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
            </>
          ) : (
            <>
              New here? <Link to="/signup" className="text-primary">Create an account</Link>
            </>
          )}
        </p>
      </section>
    </SiteShell>
  );
}
