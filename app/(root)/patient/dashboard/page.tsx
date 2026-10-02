
"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, Stethoscope, Star, User, Wallet } from "lucide-react"
import { getMyAppointments } from "@/services/appointmentService"
import { Appointment } from "@/types/appointment"
import ReviewFormModal from "@/components/web/reviews/ReviewFormModal"

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? ""

const statusStyles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
}

const paymentStatusStyles: Record<string, string> = {
    paid: "bg-[#36B9A6]/10 text-[#6ED6C5]",
    pending: "bg-yellow-500/10 text-yellow-400",
    refunded: "bg-red-500/10 text-red-400",
}

export default function PatientDashboardPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [reviewingAppointment, setReviewingAppointment] =
        useState<Appointment | null>(null)

    const fetchAppointments = async () => {
        setLoading(true)

        try {
            const data = await getMyAppointments()
            setAppointments(data ?? [])
        } catch (error) {
            console.error("Failed to fetch appointments:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    // ================= STATS =================
    const totalCount = appointments.length

    const upcomingCount = appointments.filter((a) =>
        ["pending", "confirmed"].includes(a.status)
    ).length

    const completedCount = appointments.filter(
        (a) => a.status === "confirmed"
    ).length

    return (
        <section className="min-h-screen bg-[#071E2B] py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-10">
                    <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                        Dashboard
                    </span>

                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        My Appointments
                    </h1>

                    <p className="mt-3 text-sm text-slate-400">
                        Here is a history of every doctor you've visited or booked.
                    </p>
                </div>

                {/* ================= QUICK STATS ================= */}
                {!loading && appointments.length > 0 && (
                    <div className="mb-8 grid grid-cols-3 gap-4">

                        <div className="rounded-2xl border border-white/10 bg-[#082C3C] p-4 text-center">
                            <p className="text-2xl font-bold text-white">
                                {totalCount}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Total Appointments
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#082C3C] p-4 text-center">
                            <p className="text-2xl font-bold text-white">
                                {upcomingCount}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Upcoming
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#082C3C] p-4 text-center">
                            <p className="text-2xl font-bold text-white">
                                {completedCount}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Confirmed
                            </p>
                        </div>

                    </div>
                )}

                {/* ================= APPOINTMENTS LIST ================= */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-32 animate-pulse rounded-2xl bg-white/5"
                            />
                        ))}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#082C3C] p-10 text-center">
                        <p className="text-sm text-slate-400">
                            You don't have any appointments yet.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">

                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="rounded-2xl border border-white/10 bg-[#082C3C] p-5"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                    {/* ===== DOCTOR INFO ===== */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0B3445]">
                                            {appointment.doctor?.image ? (
                                                <img
                                                    src={`${STORAGE_URL}/storage/${appointment.doctor?.image}`}
                                                    alt={appointment.doctor?.user?.name ?? "Doctor"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Stethoscope className="size-6 text-[#36B9A6]/50" />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {appointment.doctor?.user?.name ?? "Doctor"}
                                            </p>

                                            <p className="text-xs text-[#36B9A6]">
                                                {appointment.doctor?.department?.name ?? ""}
                                            </p>

                                            {/* Visited for whom */}
                                            {appointment.patient?.name && (
                                                <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
                                                    <User className="size-3.5" />
                                                    For: {appointment.patient.name}{" "}
                                                    {appointment.patient.last_name ?? ""}
                                                </p>
                                            )}

                                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">

                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-3.5" />
                                                    {appointment.appointment_date}
                                                </span>

                                                <span className="flex items-center gap-1">
                                                    <Clock className="size-3.5" />
                                                    {appointment.appointment_time}
                                                </span>

                                            </div>
                                        </div>
                                    </div>

                                    {/* ===== STATUS + ACTIONS ===== */}
                                    <div className="flex flex-col items-start gap-2 sm:items-end">

                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[appointment.status] ??
                                                "bg-white/5 text-slate-300 border-white/10"
                                                }`}
                                        >
                                            {appointment.status}
                                        </span>

                                        {/* ===== REVIEW BUTTON ===== */}
                                        {appointment.status === "confirmed" &&
                                            !appointment.review && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setReviewingAppointment(
                                                            appointment
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#36B9A6] px-4 py-1.5 text-xs font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5]"
                                                >
                                                    <Star className="size-3.5" />
                                                    Leave a Review
                                                </button>
                                            )}

                                        {/* ===== ALREADY REVIEWED ===== */}
                                        {appointment.review && (
                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                <Star className="size-3.5 fill-[#36B9A6] text-[#36B9A6]" />
                                                Reviewed
                                            </span>
                                        )}

                                    </div>
                                </div>

                                {/* ===== PAYMENT INFO ===== */}
                                {appointment.payment && (
                                    <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-2.5">

                                        <span className="flex items-center gap-2 text-xs text-slate-400">
                                            <Wallet className="size-3.5 text-[#36B9A6]" />
                                            Rs. {appointment.payment.amount}
                                        </span>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${paymentStatusStyles[
                                                appointment.payment.status
                                                ] ??
                                                "bg-white/5 text-slate-300"
                                                }`}
                                        >
                                            {appointment.payment.status}
                                        </span>

                                    </div>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </div>

            {/* ================= REVIEW MODAL ================= */}
            <ReviewFormModal
                appointment={reviewingAppointment}
                onClose={() => setReviewingAppointment(null)}
                onSuccess={() => {
                    setReviewingAppointment(null)
                    fetchAppointments()
                }}
            />
        </section>
    )
}


