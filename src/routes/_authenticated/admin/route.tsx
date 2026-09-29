import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", {
      _user_id: context.user.id,
      _role: "super_admin",
    });
    if (!data) throw redirect({ to: "/app" });
  },
  component: () => <Outlet />,
});
