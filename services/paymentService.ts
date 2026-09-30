import api from "@/lib/axios"
import { Payment } from "@/types/payment"

interface PaymentPayload {
    appointment_id?: number
    patient_id?: number
    amount?: number | string
    status?: string
    paid_at?: string
    notes?: string
}

export async function getPayments() {
    const res = await api.get("/payments")
    return res.data.data
}

export async function getPayment(id: number) {
    const res = await api.get(`/payments/${id}`)
    return res.data.data
}

export async function createPayment(payload: PaymentPayload) {
    const res = await api.post("/payments", payload)
    return res.data.data
}

export async function updatePayment(id: number, payload: PaymentPayload) {
    const res = await api.put(`/payments/${id}`, payload)
    return res.data.data
}

export async function deletePayment(id: number) {
    const res = await api.delete(`/payments/${id}`)
    return res.data
}