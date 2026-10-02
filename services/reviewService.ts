import api from "@/lib/axios"
import { Review } from "@/types/review"

interface ReviewPayload {
    appointment_id: number
    doctor_id: number
    patient_id: number
    rating: number
    comment?: string
}

export async function getReviews(doctorId?: number) {
    const res = await api.get("/reviews", {
        params: doctorId ? { doctor_id: doctorId } : {},
    })

    return res.data.data as Review[]
}

export async function createReview(payload: ReviewPayload) {
    console.log("REVIEW PAYLOAD:", payload)

    const res = await api.post("/reviews", payload)

    return res.data.data as Review
}

export async function deleteReview(id: number) {
    const res = await api.delete(`/reviews/${id}`)

    return res.data
}