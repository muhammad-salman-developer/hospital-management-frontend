"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Stethoscope,
    Clock3,
    HeartPulse,
} from "lucide-react"
import SpotlightCard from "@/components/web/SpotlightCard"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const benefits = [
    {
        id: 1,
        icon: ShieldCheck,
        title: "Secure Medical Data",
        description:
            "Your healthcare information is organized and handled with privacy in mind.",
    },
    {
        id: 2,
        icon: Stethoscope,
        title: "Qualified Doctors",
        description:
            "Connect with qualified healthcare professionals for reliable medical care.",
    },
    {
        id: 3,
        icon: Clock3,
        title: "Easy Appointments",
        description:
            "Book and manage your doctor appointments quickly from one simple platform.",
    },
    {
        id: 4,
        icon: HeartPulse,
        title: "Patient-Centered Care",
        description:
            "A simple healthcare experience designed around your needs and convenience.",
    },
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
}

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 30,
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

export default function WhyChoose() {
    return (
        <section className="relative w-full overflow-hidden bg-[#071E2B] py-16 sm:py-20 lg:py-24">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#36B9A6]/10 blur-3xl" />

            <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#36B9A6]/10 blur-3xl" />

            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                    className="grid w-full min-w-0 grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
                >
                    {/* =========================
                        LEFT - IMAGE
                    ========================== */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full min-w-0"
                    >
                        <div className="relative mx-auto w-full max-w-xl">
                            {/* Main Image */}
                            <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0B3445] p-2 shadow-2xl">
                                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[4/4] lg:aspect-[4/5]">
                                    <Image
                                        src="/choose.jpg"
                                        alt="Professional doctor providing healthcare"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover"
                                    />

                                    {/* Image Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#071E2B]/80 via-transparent to-transparent" />
                                </div>
                            </div>

                            {/* Floating Experience Card */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.4,
                                }}
                                className="absolute -bottom-5 right-2 flex items-center gap-3 rounded-2xl border border-[#36B9A6]/20 bg-[#0B3445]/95 px-4 py-3 shadow-xl backdrop-blur-md sm:-right-5 sm:px-5 sm:py-4"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#36B9A6]/10">
                                    <CheckCircle2 className="h-5 w-5 text-[#36B9A6]" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Trusted Healthcare
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Simple & Reliable
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* =========================
                        RIGHT - CONTENT
                    ========================== */}
                    <motion.div
                        variants={containerVariants}
                        className="w-full min-w-0"
                    >
                        {/* Section Heading */}
                        <motion.div variants={itemVariants}>
                            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-[#36B9A6]">
                                Why Choose HMS
                            </span>

                            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Healthcare Made
                                <span className="block text-[#36B9A6]">
                                    Simple & Reliable
                                </span>
                            </h2>

                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                                HMS brings doctors, appointments, medical
                                information, and patient care together in one
                                simple healthcare platform.
                            </p>
                        </motion.div>

                        {/* Carousel */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 w-full min-w-0"
                        >
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                                className="w-full min-w-0 max-w-full"
                            >
                                <CarouselContent className="-ml-3">
                                    {benefits.map((benefit) => {
                                        const Icon = benefit.icon

                                        return (
                                            <CarouselItem
                                                key={benefit.id}
                                                className="min-w-0 basis-full pl-3"
                                            >
                                                <SpotlightCard
                                                    className="flex min-h-[230px] w-full min-w-0 flex-col rounded-2xl border border-[#36B9A6]/20 bg-[#0B3445] p-5 shadow-lg sm:min-h-[240px] sm:p-6"
                                                    spotlightColor="rgba(54, 185, 166, 0.18)"
                                                >
                                                    {/* Icon */}
                                                    <div className="mb-5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#36B9A6]/10">
                                                        <Icon className="h-5 w-5 text-[#36B9A6]" />
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                                                        {benefit.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="mt-3 break-words text-sm leading-6 text-slate-300 sm:text-base">
                                                        {benefit.description}
                                                    </p>

                                                    {/* Bottom Line */}
                                                    <div className="mt-auto pt-5">
                                                        <div className="h-0.5 w-10 bg-[#36B9A6]" />
                                                    </div>
                                                </SpotlightCard>
                                            </CarouselItem>
                                        )
                                    })}
                                </CarouselContent>

                                {/* Carousel Controls */}
                                <div className="mt-5 flex justify-end gap-2">
                                    <CarouselPrevious className="static translate-y-0 border-white/10 bg-[#0B3445] text-white hover:border-[#36B9A6]/30 hover:bg-[#36B9A6] hover:text-[#071E2B]" />

                                    <CarouselNext className="static translate-y-0 border-white/10 bg-[#0B3445] text-white hover:border-[#36B9A6]/30 hover:bg-[#36B9A6] hover:text-[#071E2B]" />
                                </div>
                            </Carousel>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8"
                        >
                            <Link href="/doctors">
                                <span className="group inline-flex items-center gap-2 text-sm font-semibold text-[#36B9A6] transition-colors hover:text-[#6ED6C5] sm:text-base">
                                    Explore Our Doctors

                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}