"use client"

import { useEffect, useState } from "react"
import {
    Users,
    Stethoscope,
    Calendar,
    Clock,
    Wallet,
    Star,
} from "lucide-react"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    getDashboardStats,
    getAppointmentsTrend,
    getRevenueTrend,
    getTodaysAppointments,
    DashboardStats,
    TrendPoint,
} from "@/services/dashboardService"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [appointmentsTrend, setAppointmentsTrend] = useState<TrendPoint[]>([])
    const [revenueTrend, setRevenueTrend] = useState<TrendPoint[]>([])
    const [todaysAppointments, setTodaysAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsData, apptTrend, revTrend, todays] = await Promise.all([
                    getDashboardStats(),
                    getAppointmentsTrend(),
                    getRevenueTrend(),
                    getTodaysAppointments(),
                ])

                setStats(statsData)
                setAppointmentsTrend(apptTrend)
                setRevenueTrend(revTrend)
                setTodaysAppointments(todays ?? [])
            } catch (error) {
                console.error("Failed to load dashboard:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [])

    const statCards = stats
        ? [
              {
                  label: "Total Patients",
                  value: stats.total_patients,
                  icon: Users,
              },
              {
                  label: "Total Doctors",
                  value: stats.total_doctors,
                  icon: Stethoscope,
              },
              {
                  label: "Total Appointments",
                  value: stats.total_appointments,
                  icon: Calendar,
              },
              {
                  label: "Pending Appointments",
                  value: stats.pending_appointments,
                  icon: Clock,
              },
              {
                  label: "Total Revenue",
                  value: `Rs. ${stats.total_revenue.toLocaleString()}`,
                  icon: Wallet,
              },
              {
                  label: "Average Rating",
                  value: stats.average_rating || "—",
                  icon: Star,
              },
          ]
        : []

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Overview of your hospital's performance.
                </p>
            </div>

            {/* ================= STATS CARDS ================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {loading
                    ? [...Array(6)].map((_, i) => (
                          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                      ))
                    : statCards.map((card) => (
                          <Card
                              key={card.label}
                              className="bg-[#361221] text-white border-none"
                          >
                              <CardContent className="p-5">
                                  <div className="flex items-center justify-between">
                                      <div className="flex size-10 items-center justify-center rounded-xl bg-[#42182b]">
                                          <card.icon className="size-5 text-[#36B9A6]" />
                                      </div>
                                  </div>
                                  <p className="mt-4 text-2xl font-bold">{card.value}</p>
                                  <p className="mt-1 text-xs text-white/50">{card.label}</p>
                              </CardContent>
                          </Card>
                      ))}
            </div>

            {/* ================= CHARTS ================= */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Appointments Trend */}
                <Card className="bg-[#361221] text-white border-none">
                    <CardContent className="p-5">
                        <h3 className="text-sm font-semibold mb-4">
                            Appointments (Last 7 Days)
                        </h3>

                        {loading ? (
                            <Skeleton className="h-64 w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={appointmentsTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                                    <XAxis dataKey="date" stroke="#ffffff80" fontSize={12} />
                                    <YAxis stroke="#ffffff80" fontSize={12} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#42182b",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#36B9A6"
                                        strokeWidth={2}
                                        dot={{ fill: "#36B9A6" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Revenue Trend */}
                <Card className="bg-[#361221] text-white border-none">
                    <CardContent className="p-5">
                        <h3 className="text-sm font-semibold mb-4">
                            Revenue (Last 7 Days)
                        </h3>

                        {loading ? (
                            <Skeleton className="h-64 w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={revenueTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                                    <XAxis dataKey="date" stroke="#ffffff80" fontSize={12} />
                                    <YAxis stroke="#ffffff80" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#42182b",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                        formatter={(value) => [`Rs. ${value}`, "Revenue"]}
                                    />
                                    <Bar dataKey="revenue" fill="#36B9A6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ================= TODAY'S APPOINTMENTS ================= */}
            <Card className="bg-[#361221] text-white border-none">
                <CardContent className="p-5">
                    <h3 className="text-sm font-semibold mb-4">Today's Appointments</h3>

                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : todaysAppointments.length === 0 ? (
                        <p className="text-sm text-white/50">No appointments scheduled for today.</p>
                    ) : (
                        <div className="space-y-2">
                            {todaysAppointments.map((appt: any) => (
                                <div
                                    key={appt.id}
                                    className="flex items-center justify-between rounded-xl bg-[#42182b] px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {appt.patient?.name ?? "—"} {appt.patient?.last_name ?? ""}
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {appt.doctor?.user?.name ?? "—"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{appt.appointment_time}</p>
                                        <p className="text-xs capitalize text-white/50">{appt.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}