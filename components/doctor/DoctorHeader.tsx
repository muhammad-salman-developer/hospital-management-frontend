"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const pageTitles: Record<string, string> = {
    "/doctor/dashboard": "Dashboard",
    "/doctor/schedule": "My Schedule",
    "/doctor/appointments": "My Appointments",
    "/doctor/patients": "My Patients",
};

export default function DoctorHeader() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const pageTitle =
        pageTitles[pathname] ??
        (pathname.startsWith("/doctor/appointments/")
            ? "Appointment Details"
            : pathname.startsWith("/doctor/patients/")
                ? "Patient Details"
                : "Doctor Panel");

    return (
        <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#361221] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="cursor-pointer text-white hover:bg-[#42182b] hover:text-white" />
                <h1 className="text-lg font-semibold">{pageTitle}</h1>
            </div>

            <div
                className="relative"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:border-[#36B9A6]/40"
                >
                    <div className="flex size-7 items-center justify-center rounded-full bg-[#36B9A6]/20">
                        <User className="size-4 text-[#36B9A6]" />
                    </div>

                    <span className="hidden sm:inline">
                        {user?.name ?? "Doctor"}
                    </span>

                    <ChevronDown className="size-3.5 text-white/50" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full z-50 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#42182b] shadow-xl">
                        <div className="border-b border-white/10 px-4 py-3">
                            <p className="text-sm font-medium text-white">
                                {user?.name ?? "Doctor"}
                            </p>
                            <p className="text-xs text-white/60">
                                {user?.email ?? ""}
                            </p>
                        </div>

                        <button
                            onClick={logout}
                            className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-white/5"
                        >
                            <LogOut className="size-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}