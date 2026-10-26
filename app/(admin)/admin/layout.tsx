"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminLoadingScreen from "@/components/admin/AdminLoadingScreen";
import { AuthProvider } from "@/context/AuthContext";

const MIN_LOADING_TIME = 1200 // milliseconds — spinner ko ek pura rotation dikhane ke liye

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const startTime = Date.now()

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const finishChecking = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0)

      setTimeout(() => {
        setChecking(false)
      }, remaining)
    }

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== "admin") {
      router.push("/login");
      return;
    }

    finishChecking();
  }, [router]);

  if (checking) {
    return <AdminLoadingScreen />;
  }

  return (
    <AuthProvider>
      <SidebarProvider>
        <AdminSidebar />

        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <AdminHeader />

          <div className="flex-1 overflow-y-auto p-6 bg-[#F8F5F6]">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}