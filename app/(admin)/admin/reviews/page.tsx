
"use client"

import { useEffect, useState } from "react"
import { Star, Trash2, MessageSquare, User, Stethoscope } from "lucide-react"
import { toast } from "sonner"
import { getReviews, deleteReview } from "@/services/reviewService"
import { Review } from "@/types/review"

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const fetchReviews = async () => {
        setLoading(true)

        try {
            const data = await getReviews()
            setReviews(data ?? [])
        } catch (error) {
            console.error("Failed to fetch reviews:", error)
            toast.error("Failed to load reviews.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        )

        if (!confirmed) return

        setDeletingId(id)

        try {
            await deleteReview(id)

            setReviews((prev) =>
                prev.filter((review) => review.id !== id)
            )

            toast.success("Review deleted successfully.")
        } catch (error) {
            console.error("Failed to delete review:", error)
            toast.error("Failed to delete review.")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <section className="min-h-screen bg-[#361221] p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* ================= HEADER ================= */}
                <div className="mb-8">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                        Admin Panel
                    </span>

                    <div className="mt-2 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-[#42182b]">
                            <MessageSquare className="size-5 text-[#36B9A6]" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Reviews
                            </h1>

                            <p className="mt-1 text-sm text-white/50">
                                Manage patient reviews and feedback.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= STATS ================= */}
                {!loading && (
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div className="rounded-2xl border border-white/10 bg-[#42182b] p-5">
                            <p className="text-sm text-white/50">
                                Total Reviews
                            </p>

                            <p className="mt-2 text-2xl font-bold text-white">
                                {reviews.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#42182b] p-5">
                            <p className="text-sm text-white/50">
                                Average Rating
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                                <p className="text-2xl font-bold text-white">
                                    {reviews.length
                                        ? (
                                              reviews.reduce(
                                                  (sum, review) =>
                                                      sum + review.rating,
                                                  0
                                              ) / reviews.length
                                          ).toFixed(1)
                                        : "0.0"}
                                </p>

                                <Star className="size-5 fill-[#36B9A6] text-[#36B9A6]" />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#42182b] p-5">
                            <p className="text-sm text-white/50">
                                Five Star Reviews
                            </p>

                            <p className="mt-2 text-2xl font-bold text-white">
                                {
                                    reviews.filter(
                                        (review) => review.rating === 5
                                    ).length
                                }
                            </p>
                        </div>

                    </div>
                )}

                {/* ================= REVIEWS ================= */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#42182b]">

                    {/* TABLE HEADER */}
                    <div className="hidden grid-cols-[1.2fr_1.2fr_100px_2fr_80px] gap-4 border-b border-white/10 bg-[#361221]/40 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white/50 lg:grid">
                        <span>Patient</span>
                        <span>Doctor</span>
                        <span>Rating</span>
                        <span>Review</span>
                        <span className="text-right">Action</span>
                    </div>

                    {loading ? (
                        <div className="space-y-4 p-6">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="h-16 animate-pulse rounded-xl bg-[#361221]/60"
                                />
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <MessageSquare className="mx-auto size-10 text-white/20" />

                            <p className="mt-4 text-sm font-medium text-white">
                                No reviews yet
                            </p>

                            <p className="mt-1 text-xs text-white/40">
                                Patient reviews will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">

                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="grid gap-4 px-6 py-5 transition-colors hover:bg-[#361221]/30 lg:grid-cols-[1.2fr_1.2fr_100px_2fr_80px] lg:items-center"
                                >

                                    {/* PATIENT */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#361221]">
                                            <User className="size-4 text-[#36B9A6]" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {review.patient?.name ?? "Patient"}{" "}
                                                {review.patient?.last_name ?? ""}
                                            </p>

                                            <p className="text-xs text-white/40">
                                                Patient
                                            </p>
                                        </div>
                                    </div>

                                    {/* DOCTOR */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#361221]">
                                            <Stethoscope className="size-4 text-white/50" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {review.doctor?.user?.name ??
                                                    "Doctor"}
                                            </p>

                                            <p className="text-xs text-white/40">
                                                Doctor
                                            </p>
                                        </div>
                                    </div>

                                    {/* RATING */}
                                    <div className="flex items-center gap-1">
                                        <Star className="size-4 fill-[#36B9A6] text-[#36B9A6]" />

                                        <span className="text-sm font-semibold text-white">
                                            {review.rating}
                                        </span>
                                    </div>

                                    {/* COMMENT */}
                                    <div>
                                        <p className="line-clamp-2 text-sm text-white/70">
                                            {review.comment || "No comment"}
                                        </p>

                                        <p className="mt-1 text-[11px] text-white/40">
                                            {new Date(
                                                review.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* DELETE */}
                                    <div className="flex justify-start lg:justify-end">
                                        <button
                                            type="button"
                                            disabled={
                                                deletingId === review.id
                                            }
                                            onClick={() =>
                                                handleDelete(review.id)
                                            }
                                            className="flex size-9 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-300 transition-colors hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                                            title="Delete review"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            </div>
        </section>
    )
}

