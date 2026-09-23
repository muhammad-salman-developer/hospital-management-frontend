"use client"

import { ArrowRight, CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import  TextType  from "@/components/web/TextType" // adjust import path as needed

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay, ease: "easeOut" },
    }),
}

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#071E2B]">
            {/* Background Glow */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#36B9A6]/10 blur-3xl" />

            <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

                {/* Left Content */}
                <div className="max-w-2xl">
                    {/* React Bits TextType */}
                    <motion.div
                        className="min-h-[150px]"
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        variants={fadeUp}
                    >
                        <TextType
                            text={[
                                "Your Health, Our Priority.",
                                "Quality Care, Made Simple.",
                                "Healthcare You Can Trust.",
                            ]}
                            typingSpeed={75}
                            pauseDuration={1800}
                            deletingSpeed={45}
                            showCursor
                            cursorCharacter="|"
                            cursorBlinkDuration={0.5}
                            className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
                        />
                    </motion.div>

                    <motion.p
                        className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg"
                        initial="hidden"
                        animate="visible"
                        custom={0.15}
                        variants={fadeUp}
                    >
                        Manage your healthcare journey with ease. Connect with
                        qualified doctors, book appointments, and access your
                        medical information from one simple platform.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        className="mt-8 flex flex-col gap-3 sm:flex-row"
                        initial="hidden"
                        animate="visible"
                        custom={0.3}
                        variants={fadeUp}
                    >
                        <Link href="/login">
                            <Button
                                size="lg"
                                className="w-full rounded-lg bg-[#36B9A6] px-6 text-[#071E2B] hover:bg-[#2FA890] sm:w-auto cursor-pointer"
                            >
                                <CalendarDays className="mr-2 h-5 w-5" />
                                Book Appointment
                            </Button>
                        </Link>

                        <Link href="/doctors">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full rounded-lg border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-[#36B9A6] sm:w-auto cursor-pointer"
                            >
                                Meet Our Doctors
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Image */}
                <motion.div
                    className="relative mx-auto w-full max-w-xl lg:ml-auto"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="absolute -inset-4 rounded-[2rem] bg-[#36B9A6]/10 blur-2xl" />

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#082C3C] shadow-2xl">

                        <div className="relative aspect-[4/5] sm:aspect-[4/4]">
                            <Image
                                src="/hero-img.jpg"
                                alt="Healthcare professional"
                                fill
                                priority
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 576px"
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#071E2B]/70 via-transparent to-transparent" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                        >
                            <Link
                                href="/doctors"
                                className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/10 bg-[#071E2B]/90 p-4 backdrop-blur-md transition-colors hover:bg-[#071E2B]"
                            >
                                <div>
                                    <p className="font-semibold text-white">
                                        Find your doctor
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Browse by department or specialty
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-[#36B9A6]" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}