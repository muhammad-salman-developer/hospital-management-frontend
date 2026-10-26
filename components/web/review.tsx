"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import api from "@/lib/axios"

interface Review {
    id: number
    rating: number
    comment: string | null
    created_at: string
    patient?: {
        name: string
        last_name?: string | null
    }
}

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get("/reviews")
                const data: Review[] = res.data.data ?? []

                // Sirf comment wali reviews ko priority do, phir latest 3 le lo
                const withComments = data.filter(
                    (r) => r.comment && r.comment.trim() !== ""
                )
                const sorted = (withComments.length > 0 ? withComments : data).sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                )

                setReviews(sorted.slice(0, 3))
            } catch (error) {
                console.error("Failed to fetch reviews:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [])

    if (!loading && reviews.length === 0) {
        return null
    }

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
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-80 animate-pulse rounded-2xl bg-white/5"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review, index) => {
                            const name = review.patient
                                ? `${review.patient.name} ${review.patient.last_name ?? ""}`.trim()
                                : "Patient"

                            return (
                                <motion.div
                                    key={review.id}
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
                                                        starIndex < review.rating
                                                            ? "fill-[#36B9A6] text-[#36B9A6]"
                                                            : "text-white/20"
                                                    }`}
                                                />
                                            )
                                        )}
                                    </div>

                                    {/* Review */}
                                    <p className="min-h-[120px] text-[15px] leading-7 text-white/70">
                                        "{review.comment ?? "Great experience overall."}"
                                    </p>

                                    {/* Divider */}
                                    <div className="my-6 h-px bg-white/10" />

                                    {/* Patient */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#36B9A6]/15 text-sm font-semibold text-[#6ED6C5]">
                                            {name
                                                .split(" ")
                                                .filter(Boolean)
                                                .map((word) => word[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                {name}
                                            </h3>

                                            <p className="mt-0.5 text-xs text-white/40">
                                                Patient
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}