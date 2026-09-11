"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== "admin") {
      router.push("/login");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <SidebarProvider>
        <AdminSidebar />

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="flex items-center gap-2 px-4 py-6 border-b bg-[#361221] text-white ">
            <SidebarTrigger className="text-white cursor-pointer" />
            <h1 className="font-semibold text-lg">Admin Panel</h1>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 bg-[#F8F5F6]">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}