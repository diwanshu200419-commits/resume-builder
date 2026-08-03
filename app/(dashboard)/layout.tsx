import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { FloatingAICopilot } from "@/components/shared/FloatingAICopilot";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background max-w-full overflow-x-hidden">
      <Sidebar profile={profile} />
      <main className="flex-1 w-full max-w-full min-w-0 min-h-screen pt-14 lg:pt-0 pb-20">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">{children}</div>
      </main>
      <FloatingAICopilot />
    </div>
  );
}
