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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  LogOut,
  Hospital,
  Building2,
  ClipboardList,
  FlaskConical,
  Pill,
  CreditCard,
  Stethoscope,
  CalendarDays,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Departments", url: "/admin/departments", icon: Building2 },
  { title: "Doctors", url: "/admin/doctors", icon: Stethoscope },
  { title: "Doctor Shedule", url: "/admin/doctor-shedules", icon: CalendarDays },
  { title: "Patients", url: "/admin/patients", icon: Users },
  { title: "Receptionists", url: "/admin/receptionists", icon: ClipboardList },
  { title: "Labs", url: "/admin/labs", icon: FlaskConical },
  { title: "Pharmacists", url: "/admin/pharmacists", icon: Pill },
  { title: "Appointments", url: "/admin/appointments", icon: Calendar },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Reviews", url: "/admin/reviews", icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <Sidebar
      collapsible="icon"
      className="
    [&_[data-sidebar=sidebar]]:border-r-0
    [&_[data-sidebar=sidebar]]:bg-[#361221]
    text-white "
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2 mt-3">
          <Hospital className="w-6 h-6 text-blue-600 shrink-0 " />
          <span className="font-semibold text-base group-data-[collapsible=icon]:hidden ">
            HMS Admin
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Menu</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton

                    isActive={pathname === item.url}
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
                    <Link href={item.url} className="flex items-center gap-5">
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