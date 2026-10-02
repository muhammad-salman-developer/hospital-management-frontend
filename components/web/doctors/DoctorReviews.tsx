"use client"

import { useEffect } from "react"
import { Star, User } from "lucide-react"
import { useReviews } from "@/hooks/useReviews"

interface DoctorReviewsProps {
    doctorId: number
}

export default function DoctorReviews({ doctorId }: DoctorReviewsProps) {
    const { reviews, loading, fetchReviews } = useReviews(doctorId)

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const averageRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : null

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
                ))}
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-[#082C3C] p-6">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Patient Reviews</h2>
                {averageRating && (
                    <div className="flex items-center gap-1.5">
                        <Star className="size-4 fill-[#36B9A6] text-[#36B9A6]" />
                        <span className="text-sm font-semibold text-white">{averageRating}</span>
                        <span className="text-xs text-slate-400">({reviews.length})</span>
                    </div>
                )}
            </div>

            {reviews.length === 0 ? (
                <p className="text-sm text-slate-400">No reviews yet for this doctor.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="rounded-xl border border-white/10 bg-white/5 p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-[#36B9A6]/10">
                                        <User className="size-4 text-[#36B9A6]" />
                                    </div>
                                    <p className="text-sm font-medium text-white">
                                        {review.patient?.name ?? "Anonymous"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`size-3.5 ${star <= review.rating
                                                    ? "fill-[#36B9A6] text-[#36B9A6]"
                                                    : "text-slate-600"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {review.comment && (
                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}