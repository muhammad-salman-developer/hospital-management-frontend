export interface Review {
    id: number
    patient_id: number
    doctor_id: number
    appointment_id: number
    rating: number
    comment: string | null
    created_at: string
    patient?: {
        id: number
        name: string
        last_name?: string | null
    }
    doctor?: {
        id: number
        user?: {
            id: number
            name: string
        }
    }
}