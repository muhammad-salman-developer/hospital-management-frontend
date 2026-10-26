import api from "@/lib/axios"

export interface DashboardStats {
    total_patients: number
    total_doctors: number
    total_appointments: number
    pending_appointments: number
    total_revenue: number
    average_rating: number
}

export interface TrendPoint {
    date: string
    count?: number
    revenue?: number
}

export async function getDashboardStats() {
    const res = await api.get("/dashboard/stats")
    return res.data.data as DashboardStats
}

export async function getAppointmentsTrend() {
    const res = await api.get("/dashboard/appointments-trend")
    return res.data.data as TrendPoint[]
}

export async function getRevenueTrend() {
    const res = await api.get("/dashboard/revenue-trend")
    return res.data.data as TrendPoint[]
}

export async function getTodaysAppointments() {
    const res = await api.get("/dashboard/todays-appointments")
    return res.data.data
}