import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getProfile } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { FloatingAICopilot } from "@/components/shared/FloatingAICopilot";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

function DashboardSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Loading dashboard...</p>
      </div>
    </div>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background max-w-full overflow-x-hidden">
      <div className="flex w-full min-w-0">
        <Sidebar profile={profile} />
        <main className="flex-1 w-full max-w-full min-w-0 min-h-screen pt-14 lg:pt-0 pb-20">
          <TopBar profile={profile!} />
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
            <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
          </div>
        </main>
      </div>
      <FloatingAICopilot />
    </div>
  );
}
