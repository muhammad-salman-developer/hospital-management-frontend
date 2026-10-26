"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const pageTitles: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/departments": "Departments",
    "/admin/doctors": "Doctors",
    "/admin/doctor-shedules": "Doctor Schedules",
    "/admin/patients": "Patients",
    "/admin/receptionists": "Receptionists",
    // "/admin/labs": "Labs",
    // "/admin/pharmacists": "Pharmacists",
    "/admin/appointments": "Appointments",
    "/admin/payments": "Payments",
    "/admin/reviews": "Reviews",
    "/admin/contacts": "Contacts",
    '/admin/users': 'Users',
};

export default function AdminHeader() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const pageTitle = pageTitles[pathname] ?? "Admin Panel";

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-4 border-b bg-[#361221] text-white shrink-0">
            {/* Left: Sidebar toggle + Page title */}
            <div className="flex items-center gap-3">
                <SidebarTrigger className="text-white cursor-pointer" />
                <h1 className="font-semibold text-lg">{pageTitle}</h1>
            </div>

            {/* Right: User Profile Dropdown */}
            <div
                className="relative"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:border-[#36B9A6]/40 cursor-pointer">
                    <div className="flex size-7 items-center justify-center rounded-full bg-[#36B9A6]/20">
                        <User className="size-4 text-[#36B9A6]" />
                    </div>
                    <span className="hidden sm:inline">{user?.name ?? "Admin"}</span>
                    <ChevronDown className="size-3.5 text-white/50" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full w-48 overflow-hidden rounded-xl border border-white/10 bg-[#42182b] shadow-xl">
                        <div className="border-b border-white/10 px-4 py-3">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-white/50">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-white/5 cursor-pointer"
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