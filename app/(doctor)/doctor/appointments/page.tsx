
"use client"

import { useCallback, useEffect, useState } from "react"
import { CalendarCheck, Clock, RefreshCw } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getDoctorAppointments } from "@/services/appointmentService"

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true)
            setError("")

            const data = await getDoctorAppointments()

            setAppointments(
                Array.isArray(data) ? data : data?.data ?? []
            )
        } catch (err: any) {
            console.error("Doctor appointments error:", err)
            setError(
                err?.response?.data?.message ??
                "Appointments load nahi ho sakin."
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    const getStatusClass = (status: string) => {
        switch (String(status).toLowerCase()) {
            case "approved":
            case "confirmed":
                return "bg-green-100 text-green-700"
            case "completed":
                return "bg-blue-100 text-blue-700"
            case "cancelled":
                return "bg-red-100 text-red-700"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#361221]">
                        My Appointments
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Apni appointments aur patient details dekhein.
                    </p>
                </div>

                <Button
                    onClick={fetchAppointments}
                    disabled={loading}
                    className="bg-[#361221] text-white hover:bg-[#42182b]"
                >
                    <RefreshCw className="mr-2 size-4" />
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-[#361221] bg-[#361221] text-white">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-white/80">
                                Total Appointments
                            </p>
                            {loading ? (
                                <Skeleton className="mt-3 h-8 w-16" />
                            ) : (
                                <p className="mt-2 text-3xl font-bold">
                                    {appointments.length}
                                </p>
                            )}
                        </div>
                        <CalendarCheck className="size-7 text-white/80" />
                    </CardContent>
                </Card>

                <Card className="border-[#361221] bg-[#361221] text-white">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-white/80">
                                Pending Appointments
                            </p>
                            {loading ? (
                                <Skeleton className="mt-3 h-8 w-16" />
                            ) : (
                                <p className="mt-2 text-3xl font-bold">
                                    {
                                        appointments.filter(
                                            (a) =>
                                                String(a.status).toLowerCase() ===
                                                "pending"
                                        ).length
                                    }
                                </p>
                            )}
                        </div>
                        <Clock className="size-7 text-white/80" />
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden border-[#361221]">
                <div className="bg-[#361221] px-5 py-4 text-white">
                    <h2 className="font-semibold">Appointment List</h2>
                </div>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="space-y-3 p-5">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="p-10 text-center">
                            <CalendarCheck className="mx-auto size-10 text-gray-400" />
                            <p className="mt-3 font-medium text-[#361221]">
                                No appointments found
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Abhi aapki koi appointment available nahi hai.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-[#361221]">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">#</th>
                                        <th className="px-4 py-3 font-semibold">Patient</th>
                                        <th className="px-4 py-3 font-semibold">Date</th>
                                        <th className="px-4 py-3 font-semibold">Time</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {appointments.map((appointment, index) => {
                                        const patientName =
                                            appointment.patient?.user?.name ??
                                            appointment.patient?.name ??
                                            "N/A"

                                        return (
                                            <tr
                                                key={appointment.id}
                                                className="transition-colors hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-4">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-4 font-medium text-[#361221]">
                                                    {patientName}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    {appointment.appointment_date
                                                        ? String(appointment.appointment_date).slice(0, 10)
                                                        : "N/A"}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    {appointment.appointment_time
                                                        ? String(appointment.appointment_time).slice(0, 5)
                                                        : "N/A"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                                                            appointment.status
                                                        )}`}
                                                    >
                                                        {appointment.status ?? "Unknown"}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
