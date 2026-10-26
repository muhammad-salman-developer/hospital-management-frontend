"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  CreditCard,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/reception/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    url: "/reception/patient",
    icon: Users,
  },
  {
    title: "Appointments",
    url: "/reception/appointments",
    icon: Calendar,
  },
  {
    title: "Payments",
    url: "/reception/payments",
    icon: CreditCard,
  },
];

export function ReceptionSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <Sidebar
      collapsible="icon"
      className="
        [&_[data-sidebar=sidebar]]:border-r-0
        [&_[data-sidebar=sidebar]]:bg-[#361221]
        text-white
      "
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2 mt-3">
          <span className="font-semibold text-base group-data-[collapsible=icon]:hidden">
            HMS Reception
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={
                      pathname === item.url ||
                      (item.url !== "/reception/dashboard" &&
                        pathname.startsWith(`${item.url}/`))
                    }
                    tooltip={item.title}
                    className="
                      text-white/80
                      bg-transparent
                      hover:!bg-[#42182b]
                      hover:!text-white
                      focus:!bg-[#42182b]
                      focus:!text-white
                      focus-visible:!bg-[#42182b]
                      focus-visible:!text-white
                      data-[active=true]:!bg-[#42182b]
                      data-[active=true]:!text-white
                    "
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-5"
                    >
                      <item.icon className="shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}