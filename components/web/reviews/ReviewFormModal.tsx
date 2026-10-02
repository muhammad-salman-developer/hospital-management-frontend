"use client"

import { useState } from "react"
import { X, Star } from "lucide-react"
import { toast } from "sonner"
import { createReview } from "@/services/reviewService"
import { Appointment } from "@/types/appointment"

interface ReviewFormModalProps {
    appointment: Appointment | null
    onClose: () => void
    onSuccess: () => void
}

export default function ReviewFormModal({ appointment, onClose, onSuccess }: ReviewFormModalProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    if (!appointment) return null

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating.")
            return
        }

        console.log("REVIEW DATA:", {
            appointment_id: appointment.id,
            doctor_id: appointment.doctor_id,
            patient_id: appointment.patient_id,
            rating: rating,
            comment: comment.trim() || undefined,
        })

        setSubmitting(true)

        try {
            await createReview({
                appointment_id: appointment.id,
                doctor_id: appointment.doctor_id,
                patient_id: appointment.patient_id,
                rating: rating,
                comment: comment.trim() || undefined,
            })

            toast.success("Thank you for your review!")
            onSuccess()
        } catch (error: any) {
            console.error("REVIEW ERROR:", error.response?.data)

            toast.error(
                error?.response?.data?.message ?? "Failed to submit review."
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#082C3C] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
                >
                    <X className="size-4" />
                </button>

                <h3 className="text-base font-semibold text-white">Leave a Review</h3>
                <p className="mt-1 text-sm text-slate-400">
                    {appointment.doctor?.user?.name ?? "Doctor"}
                </p>

                <div className="mt-5 flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            <Star
                                className={`size-8 transition-colors ${star <= (hoverRating || rating)
                                        ? "fill-[#36B9A6] text-[#36B9A6]"
                                        : "text-slate-600"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience (optional)"
                    rows={4}
                    className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#36B9A6]/50"
                />

                <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="mt-5 w-full rounded-full bg-[#36B9A6] py-2.5 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting ? "Submitting..." : "Submit Review"}
                </button>
            </div>
        </div>
    )
}