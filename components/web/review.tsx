"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"

const reviews = [
    {
        name: "Muhammad Salman",
        role: "Patient",
        review:
            "The whole experience was smooth and professional. The doctor was very attentive and explained everything clearly.",
        rating: 5,
    },
    {
        name: "Sarah Khan",
        role: "Patient",
        review:
            "Booking an appointment was very easy and the doctor was excellent. I really liked the overall healthcare experience.",
        rating: 5,
    },
    {
        name: "Ahmed Raza",
        role: "Patient",
        review:
            "Very friendly staff and professional doctors. The appointment process was quick and convenient.",
        rating: 4,
    },
]

export default function Reviews() {
    return (
        <section className="relative overflow-hidden bg-[#071E2B] py-24">
            {/* Background Glow */}
            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#36B9A6]/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-14 max-w-2xl text-center"
                >
                    <span className="mb-4 inline-block rounded-full border border-[#36B9A6]/30 bg-[#36B9A6]/10 px-4 py-2 text-sm font-medium text-[#6ED6C5]">
                        Patient Reviews
                    </span>

                    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        What Our Patients{" "}
                        <span className="text-[#36B9A6]">
                            Say
                        </span>
                    </h2>

                    <p className="mt-5 text-base leading-7 text-white/60 sm:text-lg">
                        Real experiences from patients who trusted
                        our doctors and healthcare services.
                    </p>
                </motion.div>

                {/* Reviews */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.15,
                            }}
                            className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#36B9A6]/40 hover:bg-white/[0.06]"
                        >
                            {/* Quote */}
                            <div className="absolute right-6 top-6">
                                <Quote className="h-10 w-10 text-[#36B9A6]/20" />
                            </div>

                            {/* Stars */}
                            <div className="mb-6 flex gap-1">
                                {Array.from({ length: 5 }).map(
                                    (_, starIndex) => (
                                        <Star
                                            key={starIndex}
                                            className={`h-4 w-4 ${
                                                starIndex <
                                                review.rating
                                                    ? "fill-[#36B9A6] text-[#36B9A6]"
                                                    : "text-white/20"
                                            }`}
                                        />
                                    )
                                )}
                            </div>

                            {/* Review */}
                            <p className="min-h-[120px] text-[15px] leading-7 text-white/70">
                                “{review.review}”
                            </p>

                            {/* Divider */}
                            <div className="my-6 h-px bg-white/10" />

                            {/* Patient */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#36B9A6]/15 text-sm font-semibold text-[#6ED6C5]">
                                    {review.name
                                        .split(" ")
                                        .map((word) => word[0])
                                        .join("")
                                        .slice(0, 2)}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-white">
                                        {review.name}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-white/40">
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

