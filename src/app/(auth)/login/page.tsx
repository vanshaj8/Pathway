import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in — Pathway",
  description: "Sign in to your Pathway account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
