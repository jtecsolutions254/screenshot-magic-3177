import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Kwetu Connection" },
      { name: "description", content: "Start your Wi-Fi hotspot business on Kwetu Connection. 14-day free trial." },
      { property: "og:title", content: "Create account — Kwetu Connection" },
      { property: "og:description", content: "Launch your paid Wi-Fi business in minutes." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
