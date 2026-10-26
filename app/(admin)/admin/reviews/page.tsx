"use client"

import { useEffect, useState } from "react"
import { Star, Trash2, MessageSquare, User, Stethoscope } from "lucide-react"
import { toast } from "sonner"
import { getReviews, deleteReview } from "@/services/reviewService"
import { Review } from "@/types/review"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingReview, setDeletingReview] = useState<Review | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

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

    const handleConfirmDelete = async () => {
        if (!deletingReview) return

        setDeleteLoading(true)

        try {
            await deleteReview(deletingReview.id)

            setReviews((prev) =>
                prev.filter((review) => review.id !== deletingReview.id)
            )

            setDeletingReview(null)
            toast.success("Review deleted successfully")
        } catch (error) {
            console.error("Failed to delete review:", error)
            toast.error("Failed to delete review")
        } finally {
            setDeleteLoading(false)
        }
    }

    const averageRating = reviews.length
        ? (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
          ).toFixed(1)
        : "0.0"

    const fiveStarCount = reviews.filter((review) => review.rating === 5).length

    const statCards = [
        {
            label: "Total Reviews",
            value: reviews.length,
            icon: MessageSquare,
        },
        {
            label: "Average Rating",
            value: averageRating,
            icon: Star,
        },
        {
            label: "Five Star Reviews",
            value: fiveStarCount,
            icon: Star,
        },
    ]

    return (
        <div className="p-6 space-y-6">
            {/* ================= HEADER ================= */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage patient reviews and feedback.
                </p>
            </div>

            {/* ================= STATS CARDS ================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {loading
                    ? [...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                      ))
                    : statCards.map((card) => (
                          <Card
                              key={card.label}
                              className="bg-[#361221] text-white border-none"
                          >
                              <CardContent className="p-5">
                                  <div className="flex items-center justify-between">
                                      <div className="flex size-10 items-center justify-center rounded-xl bg-[#42182b]">
                                          <card.icon className="size-5 text-[#36B9A6]" />
                                      </div>
                                  </div>
                                  <p className="mt-4 text-2xl font-bold">{card.value}</p>
                                  <p className="mt-1 text-xs text-white/50">{card.label}</p>
                              </CardContent>
                          </Card>
                      ))}
            </div>

            {/* ================= REVIEWS TABLE ================= */}
            <Card className="bg-[#361221] text-white border-none p-3">
                <CardContent className="p-0">
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
                                    <Skeleton
                                        key={index}
                                        className="h-16 w-full rounded-xl"
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
                                                onClick={() => setDeletingReview(review)}
                                                className="flex size-9 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-300 transition-colors hover:bg-red-400/20"
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
                </CardContent>
            </Card>

            {/* ================= DELETE CONFIRMATION DIALOG ================= */}
            <Dialog
                open={!!deletingReview}
                onOpenChange={(open) => !open && setDeletingReview(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        This review by{" "}
                        <span className="font-medium text-foreground">
                            {deletingReview?.patient?.name}
                        </span>{" "}
                        for{" "}
                        <span className="font-medium text-foreground">
                            {deletingReview?.doctor?.user?.name}
                        </span>{" "}
                        will be permanently deleted.
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setDeletingReview(null)}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}