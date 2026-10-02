"use client"

import { useCallback, useState } from "react"
import { Review } from "@/types/review"
import { getReviews, deleteReview as deleteReviewService } from "@/services/reviewService"

export function useReviews(doctorId?: number) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchReviews = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const data = await getReviews(doctorId)
            setReviews(data ?? [])
        } catch (err: any) {
            console.error("Failed to fetch reviews:", err)
            setError(err?.response?.data?.message ?? "Failed to load reviews.")
        } finally {
            setLoading(false)
        }
    }, [doctorId])

    const removeReview = useCallback(async (id: number) => {
        await deleteReviewService(id)
        setReviews((prev) => prev.filter((r) => r.id !== id))
    }, [])

    return { reviews, loading, error, fetchReviews, removeReview }
}