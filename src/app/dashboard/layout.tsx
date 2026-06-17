import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireAuthenticatedUser } from "@/lib/journey/queries";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-full">
      <DashboardHeader />
      {children}
    </div>
  );
}
