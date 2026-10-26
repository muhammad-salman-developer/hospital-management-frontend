export type StaffRole = "doctor" | "receptionist" 

export interface StaffUser {
    id: number
    name: string
    email: string
    roles: { id: number; name: string }[]
}