import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Kwetu Connection" },
      { name: "description", content: "Sign in to your Kwetu Connection hotspot business dashboard." },
      { property: "og:title", content: "Sign in — Kwetu Connection" },
      { property: "og:description", content: "Manage your Wi-Fi hotspot business." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
