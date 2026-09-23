"use client"

import {
    CalendarDays,
    ClipboardList,
    FileText,
    Pill,
    Stethoscope,
    Headphones,
} from "lucide-react"
import { motion } from "framer-motion"

import SpotlightCard from "./SpotlightCard"

const services = [
    {
        icon: Stethoscope,
        title: "Find a Doctor",
        description:
            "Find qualified doctors and choose the right specialist for your healthcare needs.",
    },
    {
        icon: CalendarDays,
        title: "Book Appointments",
        description:
            "Book appointments with your preferred doctor quickly and conveniently.",
    },
    {
        icon: ClipboardList,
        title: "Medical Departments",
        description:
            "Explore hospital departments and find the right healthcare service for you.",
    },
    {
        icon: FileText,
        title: "Medical Records",
        description:
            "Keep your important medical information organized and easily accessible.",
    },
    {
        icon: Pill,
        title: "Prescriptions",
        description:
            "Access your prescriptions and keep track of your recommended medications.",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description:
            "Get assistance whenever you need help navigating your healthcare journey.",
    },
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
}

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 35,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
}

export default function Services() {
    return (
        <section className="bg-[#071E2B] py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-14 max-w-2xl text-center"
                >
                    <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-[#36B9A6]">
                        Our Services
                    </span>

                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Everything You Need for
                        <span className="block text-[#36B9A6]">
                            Better Healthcare
                        </span>
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
                        From finding the right doctor to managing your
                        appointments and medical information, HMS makes
                        healthcare simpler.
                    </p>
                </motion.div>

                {/* Service Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {services.map((service) => {
                        const Icon = service.icon

                        return (
                            <motion.div
                                key={service.title}
                                variants={cardVariants}
                                className="h-full"
                            >
                                <SpotlightCard
                                    className="group h-full min-h-[250px] rounded-2xl border border-white/10 bg-[#082C3C] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#36B9A6]/40"
                                    spotlightColor="rgba(54, 185, 166, 0.18)"
                                >
                                    {/* Icon */}
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B9A6]/10 transition-colors duration-300 group-hover:bg-[#36B9A6]">
                                        <Icon className="h-6 w-6 text-[#36B9A6] transition-colors duration-300 group-hover:text-[#071E2B]" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-white">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        {service.description}
                                    </p>

                                    {/* Accent */}
                                    <div className="mt-6 h-0.5 w-10 bg-[#36B9A6] transition-all duration-300 group-hover:w-16" />
                                </SpotlightCard>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}