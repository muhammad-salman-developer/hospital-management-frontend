
export type Gender = "male" | "female" | "other"

export interface Patient {
    id: number
    user_id: number | null
    name: string
    email?: string | null
    phone: string | null
    last_name: string | null
    cnic: string | null
    date_of_birth: string | null
    gender: Gender | null
    address: string | null
    user?: {
        id: number
        name: string
        email: string
        phone_number: string | null
    } | null
}
