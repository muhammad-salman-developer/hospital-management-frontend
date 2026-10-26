"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReceptionSidebar } from "@/components/reception/ReceptionSidebar";
import ReceptionHeader from "@/components/reception/ReceptionHeader";

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "receptionist") {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <ReceptionSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <ReceptionHeader />

        <div className="flex-1 overflow-y-auto p-6 bg-[#F8F5F6]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}