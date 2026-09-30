export type PaymentStatus = "paid" | "refunded" | "pending"

export interface Payment {
    id: number
    appointment_id: number
    patient_id: number
    amount: string | number
    status: PaymentStatus
    paid_at: string | null
    notes: string | null
    created_at: string
    updated_at: string
    appointment?: {
        id: number
        appointment_date: string
        appointment_time: string
        doctor?: {
            id: number
            user?: {
                id: number
                name: string
            }
        }
    }
    patient?: {
        id: number
        name: string
        last_name?: string | null
    }
}