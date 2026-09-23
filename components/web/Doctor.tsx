"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Stethoscope } from "lucide-react"
import { motion } from "framer-motion"
import api from "@/lib/axios"

const STORAGE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ??
    "http://127.0.0.1:8000"

interface Doctor {
    id: number
    specialization: string
    qualification: string
    consultation_fee: string
    image: string | null
    user?: {
        name: string
    }
    department?: {
        id: number
        name: string
    }
}

interface DoctorSchedule {
    id: number
    doctor_id: number
    day: string
    start_time: string
    end_time: string
    is_available: boolean
}

const DAY_SHORT: Record<string, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
}

export function DoctorsSection() {
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [schedulesByDoctor, setSchedulesByDoctor] = useState<
        Record<number, DoctorSchedule[]>
    >({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDoctorsAndSchedules = async () => {
            try {
                const doctorsRes = await api.get("/doctors")

                const doctorsData: Doctor[] =
                    doctorsRes.data.data?.data ??
                    doctorsRes.data.data ??
                    []

                const featured = doctorsData.slice(0, 6)

                setDoctors(featured)

                const scheduleResults = await Promise.all(
                    featured.map((doc) =>
                        api
                            .get("/doctor-shedules", {
                                params: {
                                    doctor_id: doc.id,
                                },
                            })
                            .then((res) => ({
                                doctorId: doc.id,
                                schedules: (res.data.data ??
                                    []) as DoctorSchedule[],
                            }))
                            .catch(() => ({
                                doctorId: doc.id,
                                schedules: [],
                            }))
                    )
                )

                const map: Record<number, DoctorSchedule[]> = {}

                scheduleResults.forEach((result) => {
                    map[result.doctorId] =
                        result.schedules.filter(
                            (schedule) => schedule.is_available
                        )
                })

                setSchedulesByDoctor(map)
            } catch (error) {
                console.error("Failed to fetch doctors:", error)
                setDoctors([])
            } finally {
                setLoading(false)
            }
        }

        fetchDoctorsAndSchedules()
    }, [])

    return (
        <section className="relative overflow-hidden bg-[#071E2B] py-20 sm:py-24">
            <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-[#36B9A6]/5 blur-3xl" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                            Our Team
                        </span>

                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Meet Our Doctors
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                            Meet our qualified healthcare professionals and
                            find the right doctor for your healthcare needs.
                        </p>
                    </div>

                    <Link
                        href="/doctors"
                        className="hidden items-center gap-1 text-sm text-slate-300 transition-colors hover:text-[#36B9A6] sm:inline-flex"
                    >
                        View all doctors
                        <ArrowUpRight className="size-4" />
                    </Link>
                </div>

                {/* ================= LOADING ================= */}
                {loading ? (
                    <div className="flex gap-5 overflow-hidden">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="h-[470px] w-72 shrink-0 animate-pulse rounded-2xl bg-white/5"
                            />
                        ))}
                    </div>
                ) : doctors.length === 0 ? (
                    <p className="py-10 text-sm text-slate-400">
                        Doctor profiles will appear here once added.
                    </p>
                ) : (

                    /* ================= DOCTOR CARDS ================= */
                    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 scrollbar-none">
                        {doctors.map((doctor, index) => {
                            const schedules =
                                schedulesByDoctor[doctor.id] ?? []

                            return (
                                <motion.div
                                    key={doctor.id}
                                    initial={{
                                        opacity: 0,
                                        y: 25,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{
                                        once: true,
                                        amount: 0.2,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.08,
                                    }}
                                    className="w-72 shrink-0 snap-start"
                                >
                                    <Link
                                        href={`/doctors/${doctor.id}`}
                                        className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#082C3C] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#36B9A6]/40 hover:shadow-xl"
                                    >

                                        {/* ================= IMAGE ================= */}
                                        <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-[#0B3445]">

                                            {doctor.image ? (
                                                <img
                                                    src={`${STORAGE_URL}/storage/${doctor.image}`}
                                                    alt={
                                                        doctor.user?.name ??
                                                        "Doctor"
                                                    }
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Stethoscope className="size-12 text-[#36B9A6]/40" />
                                                </div>
                                            )}

                                            {/* Image Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#071E2B]/90 via-[#071E2B]/10 to-transparent" />

                                            {/* ================= DEPARTMENT BADGE ================= */}
                                            {doctor.department?.name && (
                                                <div className="absolute bottom-4 left-4">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#36B9A6]/30 bg-[#071E2B]/90 px-3 py-1.5 text-xs font-semibold capitalize text-[#6ED6C5] shadow-lg backdrop-blur-md">
                                                        <Stethoscope className="size-3.5" />
                                                        {doctor.department.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* ================= CONTENT ================= */}
                                        <div className="flex flex-col p-5">

                                            {/* Doctor Name */}
                                            <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-[#6ED6C5]">
                                                {doctor.user?.name ??
                                                    "Doctor"}
                                            </h3>

                                            {/* Specialization */}
                                            <p className="mt-1 text-sm font-medium text-[#36B9A6]">
                                                {doctor.specialization}
                                            </p>

                                            {/* Qualification */}
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
                                                        {schedules.map(
                                                            (schedule) => (
                                                                <span
                                                                    key={
                                                                        schedule.id
                                                                    }
                                                                    className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-[11px] text-slate-300"
                                                                >
                                                                    {DAY_SHORT[
                                                                        schedule
                                                                            .day
                                                                    ] ??
                                                                        schedule.day}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Divider */}
                                            <div className="my-4 h-px bg-white/10" />

                                            {/* ================= FOOTER ================= */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                                        Consultation fee
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-semibold text-white">
                                                        Rs.{" "}
                                                        {
                                                            doctor.consultation_fee
                                                        }
                                                    </p>
                                                </div>

                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#36B9A6] transition-colors group-hover:text-[#6ED6C5]">
                                                    View Profile
                                                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* ================= MOBILE VIEW ALL ================= */}
                <Link
                    href="/doctors"
                    className="mt-6 inline-flex items-center gap-1 text-sm text-slate-300 transition-colors hover:text-[#36B9A6] sm:hidden"
                >
                    View all doctors
                    <ArrowUpRight className="size-4" />
                </Link>
            </div>
        </section>
    )
}