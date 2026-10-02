"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Stethoscope,
    ArrowLeft,
    Calendar,
    Clock,
    GraduationCap,
    Wallet,
} from "lucide-react"
import api from "@/lib/axios"
import { Doctor } from "@/types/doctor"
import { DoctorSchedule } from "@/types/doctorSchedule"
import { DAY_SHORT, STORAGE_URL } from "@/lib/constants"
import BookingModal from "@/components/web/doctors/BookingModal"
import DoctorReviews from "@/components/web/doctors/DoctorReviews"
export default function DoctorProfilePage() {
    const params = useParams()
    const router = useRouter()
    const doctorId = params.id as string

    const [doctor, setDoctor] = useState<Doctor | null>(null)
    const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null)

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const doctorRes = await api.get(`/doctors/${doctorId}`)
                const doctorData: Doctor = doctorRes.data.data ?? doctorRes.data

                setDoctor(doctorData)

                const scheduleRes = await api.get("/doctor-shedules", {
                    params: { doctor_id: doctorId },
                })

                const scheduleData: DoctorSchedule[] = scheduleRes.data.data ?? []

                setSchedules(scheduleData.filter((s) => s.is_available))
            } catch (error) {
                console.error("Failed to fetch doctor:", error)
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }

        if (doctorId) {
            fetchDoctor()
        }
    }, [doctorId])

    if (loading) {
        return (
            <section className="min-h-screen bg-[#071E2B] py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-[380px_1fr]">
                        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
                        <div className="space-y-4">
                            <div className="h-8 w-1/2 animate-pulse rounded bg-white/5" />
                            <div className="h-4 w-1/3 animate-pulse rounded bg-white/5" />
                            <div className="h-4 w-1/4 animate-pulse rounded bg-white/5" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (notFound || !doctor) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#071E2B]">
                <div className="text-center">
                    <p className="text-lg text-white">Doctor not found.</p>
                    <button
                        onClick={() => router.push("/doctors")}
                        className="mt-4 inline-flex items-center gap-1 text-sm text-[#36B9A6] hover:text-[#6ED6C5] cursor-pointer"
                    >
                        <ArrowLeft className="size-4 " />
                        Back to doctors
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-screen bg-[#071E2B] py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                {/* ================= BACK LINK ================= */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-[#36B9A6] cursor-pointer"
                >
                    <ArrowLeft className="size-4" />
                    Back
                </button>

                {/* ================= SPLIT LAYOUT ================= */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[380px_1fr]">

                    {/* ================= LEFT: IMAGE ================= */}
                    <div className="md:sticky md:top-24 md:self-start">
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#082C3C] shadow-lg">
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0B3445]">{doctor.image ? (
                                <img
                                    src={`${STORAGE_URL}/storage/${doctor.image}`}
                                    alt={doctor.user?.name ?? "Doctor"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Stethoscope className="size-16 text-[#36B9A6]/40" />
                                </div>
                            )}

                                {doctor.status === "on_leave" && (
                                    <div className="absolute top-4 right-4">
                                        <span className="rounded-full bg-yellow-500/90 px-2.5 py-1 text-[10px] font-semibold text-black">
                                            On Leave
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Book button under image on desktop */}
                            <div className="p-5">
                                <button
                                    type="button"
                                    disabled={doctor.status !== "active"}
                                    onClick={() => setIsBookingModalOpen(true)}
                                    className="w-full rounded-full bg-[#36B9A6] px-6 py-3 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT: DETAILS ================= */}
                    <div className="flex flex-col gap-6">

                        {/* Name + specialization + department */}
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Name:
                                </span>
                                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                    {doctor.user?.name ?? "Doctor"}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Department:
                                </span>
                                <span className="text-sm font-medium capitalize text-[#6ED6C5]">
                                    {doctor.department?.name ?? "N/A"}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Specialization:
                                </span>
                                <span className="text-sm font-medium text-[#36B9A6]">
                                    {doctor.specialization}
                                </span>
                            </div>
                        </div>

                        {/* Detail rows: qualification, fee */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#082C3C] p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#36B9A6]/10">
                                    <GraduationCap className="size-5 text-[#36B9A6]" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                        Qualification:
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-white">
                                        {doctor.qualification}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#082C3C] p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#36B9A6]/10">
                                    <Wallet className="size-5 text-[#36B9A6]" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                        Consultation fee:
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-white">
                                        Rs. {doctor.consultation_fee}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="rounded-2xl border border-white/10 bg-[#082C3C] p-6">
                            <h2 className="mb-4 text-base font-semibold text-white">
                                Availability:
                            </h2>

                            {schedules.length === 0 ? (
                                <p className="text-sm text-slate-400">
                                    No schedule available for this doctor right now.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {schedules.map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                                        >
                                            <span className="flex items-center gap-2 text-sm text-slate-300">
                                                <Calendar className="size-4 text-[#36B9A6]" />
                                                {DAY_SHORT[schedule.day] ?? schedule.day}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                <Clock className="size-3.5" />
                                                {schedule.start_time} - {schedule.end_time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile-only book button */}
                        <button
                            type="button"
                            disabled={doctor.status !== "active"}
                            onClick={() => setIsBookingModalOpen(true)}
                            className="w-full rounded-full bg-[#36B9A6] px-6 py-3 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 md:hidden"
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= BOOKING MODAL ================= */}
            <BookingModal
                isOpen={isBookingModalOpen}
                doctor={doctor}
                schedules={schedules}
                selectedSchedule={selectedSchedule}
                onSelectSchedule={setSelectedSchedule}
                onClose={() => {
                    setIsBookingModalOpen(false)
                    setSelectedSchedule(null)
                }}
                onConfirm={() => {
                    console.log("Booking:", doctor.id, selectedSchedule?.id)
                    setIsBookingModalOpen(false)
                    setSelectedSchedule(null)
                }}
            />
            <div className="mt-8">
                <DoctorReviews doctorId={doctor.id} />
            </div>
        </section>
    )
}