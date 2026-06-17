import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account — Pathway",
  description: "Create your Pathway account and start your journey.",
};

export default function SignupPage() {
  return <SignupForm />;
}
