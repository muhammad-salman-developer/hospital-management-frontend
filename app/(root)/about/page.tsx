"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    HeartPulse,
    ShieldCheck,
    Clock,
    Stethoscope,
    ArrowUpRight,
    Users,
    Building2,
} from "lucide-react"
import api from "@/lib/axios"

export default function AboutPage() {
    const [doctorCount, setDoctorCount] = useState<number | null>(null)
    const [departmentCount, setDepartmentCount] = useState<number | null>(null)

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [doctorsRes, departmentsRes] = await Promise.all([
                    api.get("/doctors"),
                    api.get("/departments"),
                ])

                const doctorsData =
                    doctorsRes.data.data?.data ?? doctorsRes.data.data ?? []
                const departmentsData =
                    departmentsRes.data.data?.data ?? departmentsRes.data.data ?? []

                setDoctorCount(doctorsData.length)
                setDepartmentCount(departmentsData.length)
            } catch (error) {
                console.error("Failed to fetch counts:", error)
            }
        }

        fetchCounts()
    }, [])

    const stats = [
        { label: "Qualified Doctors", value: doctorCount ?? "—", icon: Stethoscope },
        { label: "Departments", value: departmentCount ?? "—", icon: Building2 },
        { label: "Patients Served", value: "2,500+", icon: Users },
        { label: "Years of Service", value: "10+", icon: Clock },
    ]

    const values = [
        {
            icon: HeartPulse,
            title: "Patient-first care",
            description:
                "Every decision we make starts with what is best for the person in front of us, not what is easiest for the system.",
        },
        {
            icon: ShieldCheck,
            title: "Trusted expertise",
            description:
                "Our doctors are board-certified specialists who keep up with the latest medical practices and technology.",
        },
        {
            icon: Clock,
            title: "Timely appointments",
            description:
                "Book online in minutes and see a doctor on a schedule that fits your life, not the other way around.",
        },
        {
            icon: Stethoscope,
            title: "Comprehensive services",
            description:
                "From routine checkups to specialist consultations, we bring multiple departments together under one roof.",
        },
    ]

    return (
        <main className="bg-[#071E2B]">

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden py-24 sm:py-32">
                <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#36B9A6]/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#36B9A6]/5 blur-3xl" />

                <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                        About Us
                    </span>

                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Healthcare that puts you first
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                        We built this hospital to close the gap between people and the
                        care they need — qualified doctors, modern facilities, and an
                        appointment system that respects your time.
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            href="/doctors"
                            className="rounded-full bg-[#36B9A6] px-6 py-3 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5]"
                        >
                            Find a Doctor
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#36B9A6]/40 hover:text-[#6ED6C5]"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= STATS ================= */}
            <section className="border-y border-white/10 bg-[#082C3C] py-14">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <stat.icon className="mx-auto mb-3 size-6 text-[#36B9A6]" />
                            <p className="text-3xl font-bold text-white sm:text-4xl">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= OUR STORY ================= */}
            <section className="py-20 sm:py-24">
                <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
                    <div>
                        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                            Our Story
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Built around the patient, not the paperwork
                        </h2>
                        <p className="mt-5 text-base leading-7 text-slate-400">
                            For over a decade, our hospital has grown from a single
                            consultation room into a multi-department facility, but our
                            founding idea has never changed: healthcare should be easy to
                            reach, easy to understand, and delivered by people who care.
                        </p>
                        <p className="mt-4 text-base leading-7 text-slate-400">
                            Today, our doctors, nurses, and support staff work across
                            several specialties to give every patient a clear path from
                            their first symptom to their full recovery.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="rounded-2xl border border-white/10 bg-[#082C3C] p-6">
                            <h3 className="text-lg font-semibold text-white">Our Mission</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                To provide accessible, high-quality healthcare to every
                                patient who walks through our doors.
                            </p>
                        </div>
                        <div className="mt-8 rounded-2xl border border-white/10 bg-[#082C3C] p-6">
                            <h3 className="text-lg font-semibold text-white">Our Vision</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                To be the region's most trusted healthcare provider,
                                known for outcomes and compassion alike.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= WHY CHOOSE US ================= */}
            <section className="border-t border-white/10 bg-[#082C3C]/40 py-20 sm:py-24">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 max-w-xl">
                        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                            Why Choose Us
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            What sets our care apart
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="rounded-2xl border border-white/10 bg-[#082C3C] p-6"
                            >
                                <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-[#36B9A6]/10">
                                    <value.icon className="size-5 text-[#36B9A6]" />
                                </div>
                                <h3 className="text-base font-semibold text-white">
                                    {value.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="py-20 sm:py-24">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to see a doctor?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-400">
                        Browse our specialists and book an appointment in just a few
                        clicks.
                    </p>
                    <Link
                        href="/doctors"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#36B9A6] px-8 py-3.5 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5]"
                    >
                        Browse Doctors
                        <ArrowUpRight className="size-4" />
                    </Link>
                </div>
            </section>
        </main>
    )
}