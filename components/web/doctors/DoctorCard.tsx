"use client"

import Link from "next/link"
import { Stethoscope, ArrowUpRight } from "lucide-react"
import { Doctor } from "@/types/doctor"
import { DoctorSchedule } from "@/types/doctorSchedule"
import { DAY_SHORT,STORAGE_URL } from "@/lib/constants"

interface DoctorCardProps {
    doctor: Doctor
    schedules: DoctorSchedule[]
    onBook: (doctor: Doctor) => void
}

export default function DoctorCard({ doctor, schedules, onBook }: DoctorCardProps) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#082C3C] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#36B9A6]/40 hover:shadow-xl">

           
            {/* ================= IMAGE ================= */}
            <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-[#0B3445]">
                {doctor.image ? (
                    <img
                        src={`${STORAGE_URL}/storage/${doctor.image}`}
                        alt={doctor.user?.name ?? "Doctor"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Stethoscope className="size-12 text-[#36B9A6]/40" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2B]/90 via-[#071E2B]/10 to-transparent" />

                {doctor.department?.name && (
                    <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#36B9A6]/30 bg-[#071E2B]/90 px-3 py-1.5 text-xs font-semibold capitalize text-[#6ED6C5] shadow-lg backdrop-blur-md">
                            <Stethoscope className="size-3.5" />
                            {doctor.department.name}
                        </span>
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

            {/* ================= CONTENT ================= */}
            <div className="flex flex-col p-5">
                <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-[#6ED6C5]">
                    {doctor.user?.name ?? "Doctor"}
                </h3>

                <p className="mt-1 text-sm font-medium text-[#36B9A6]">
                    {doctor.specialization}
                </p>

                <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                    {doctor.qualification}
                </p>

                {/* ================= SCHEDULE ================= */}
                <div className="mt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Available
                    </p>

                    {schedules.length === 0 ? (
                        <span className="text-xs text-slate-500">
                            Schedule not available
                        </span>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {schedules.map((schedule) => (
                                <span
                                    key={schedule.id}
                                    className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-[11px] text-slate-300"
                                >
                                    {DAY_SHORT[schedule.day] ?? schedule.day}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="my-4 h-px bg-white/10" />

                {/* ================= FOOTER ================= */}
                <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Consultation fee
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white">
                        Rs. {doctor.consultation_fee}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={doctor.status !== "active"}
                        onClick={() => onBook(doctor)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#36B9A6] px-3 py-2 text-xs font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Book Appointment
                    </button>

                    <Link
                        href={`/doctors/${doctor.id}`}
                        className="inline-flex items-center justify-center gap-1 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-[#36B9A6]/40 hover:text-[#6ED6C5]"
                    >
                        Profile
                        <ArrowUpRight className="size-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}