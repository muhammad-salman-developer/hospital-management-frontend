"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar"

import { DoctorSidebar } from "@/components/doctor/DoctorSidebar"
import DoctorHeader from "@/components/doctor/DoctorHeader"

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem("role")

        if (!token || role !== "doctor") {
            router.replace("/login")
            return
        }

        setAuthorized(true)
    }, [router])

    if (!authorized) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Checking access...
                </p>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <DoctorSidebar />

            <SidebarInset className="min-w-0">
                <DoctorHeader />

                <main className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}