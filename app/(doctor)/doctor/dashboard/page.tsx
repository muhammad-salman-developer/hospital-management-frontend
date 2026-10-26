
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    CalendarDays,
    CalendarCheck,
    Users,
    Clock,
    ArrowRight,
    Stethoscope,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getDoctorAppointments } from "@/services/appointmentService"
import { usePatients } from "@/hooks/usePatients"

export default function DoctorDashboard() {
    const {
        patients,
        loading: patientsLoading,
        fetchDoctorPatients,
    } = usePatients()

    const [appointments, setAppointments] = useState<any[]>([])
    const [appointmentsLoading, setAppointmentsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchDoctorPatients()
    }, [fetchDoctorPatients])

    useEffect(() => {
        let active = true

        async function loadAppointments() {
            try {
                setAppointmentsLoading(true)
                setError("")

                const data = await getDoctorAppointments()

                if (active) {
                    setAppointments(
                        Array.isArray(data)
                            ? data
                            : data?.data ?? []
                    )
                }
            } catch (err: any) {
                console.error("Doctor appointments error:", err)

                if (active) {
                    setError(
                        err?.response?.data?.message ??
                        "Appointments load nahi ho sakin."
                    )
                }
            } finally {
                if (active) {
                    setAppointmentsLoading(false)
                }
            }
        }

        loadAppointments()

        return () => {
            active = false
        }
    }, [])

    const pendingAppointments = appointments.filter(
        (appointment) =>
            String(appointment.status).toLowerCase() === "pending"
    ).length

    const stats = [
        {
            title: "My Appointments",
            value: appointments.length,
            icon: CalendarCheck,
        },
        {
            title: "Pending Appointments",
            value: pendingAppointments,
            icon: Clock,
        },
        {
            title: "Patients",
            value: patients?.length ?? 0,
            icon: Users,
        },
    ]

    const loading = appointmentsLoading || patientsLoading

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#361221]">
                    Doctor Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Apni appointments, patients aur schedule manage karein.
                </p>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <Card
                            key={stat.title}
                            className="border-[#361221] bg-[#361221] text-white transition-colors hover:bg-[#42182b]"
                        >
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-white/80">
                                        {stat.title}
                                    </p>
                                    <Icon className="size-5 text-white/80" />
                                </div>

                                {loading ? (
                                    <Skeleton className="mt-4 h-8 w-20" />
                                ) : (
                                    <p className="mt-4 text-3xl font-bold">
                                        {stat.value}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div>
                <h2 className="mb-4 text-lg font-semibold text-[#361221]">
                    Quick Access
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/doctor/schedule">
                        <Card className="h-full cursor-pointer border-[#361221] transition-colors hover:bg-[#42182b]/5">
                            <CardContent className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#361221] text-white">
                                        <CalendarDays className="size-6" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#361221]">
                                            My Schedule
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Apne working days aur timings set karein.
                                        </p>
                                    </div>
                                </div>

                                <ArrowRight className="size-5 text-[#361221]" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/doctor/appointments">
                        <Card className="h-full cursor-pointer border-[#361221] transition-colors hover:bg-[#42182b]/5">
                            <CardContent className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#361221] text-white">
                                        <Stethoscope className="size-6" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#361221]">
                                            My Appointments
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Apni appointments dekhein.
                                        </p>
                                    </div>
                                </div>

                                <ArrowRight className="size-5 text-[#361221]" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
