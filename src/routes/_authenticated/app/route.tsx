import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchMyBusiness } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/app")({
  beforeLoad: async ({ context, location }) => {
    const business = await context.queryClient.fetchQuery({
      queryKey: ["my-business"],
      queryFn: fetchMyBusiness,
      staleTime: 30_000,
    });
    if (!business && location.pathname !== "/app/setup") {
      throw redirect({ to: "/app/setup" });
    }
  },
  component: () => <Outlet />,
});
