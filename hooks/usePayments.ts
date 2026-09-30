"use client"

import { useCallback, useState } from "react"
import { Payment } from "@/types/payment"
import { getPayments, deletePayment as deletePaymentService } from "@/services/paymentService"

export function usePayments() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchPayments = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const data = await getPayments()
            setPayments(data?.data ?? data ?? [])
        } catch (err: any) {
            console.error("Failed to fetch payments:", err)
            setError(err?.response?.data?.message ?? "Failed to load payments.")
        } finally {
            setLoading(false)
        }
    }, [])

    const removePayment = useCallback(async (id: number) => {
        await deletePaymentService(id)
        setPayments((prev) => prev.filter((p) => p.id !== id))
    }, [])

    return { payments, loading, error, fetchPayments, removePayment }
}