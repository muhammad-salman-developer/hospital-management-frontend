import { Payment } from "@/types/payment"

export type AppointmentStatus = "pending" | "confirmed" | "cancelled"

export interface Appointment {
  id: number
  patient_id: number
  doctor_id: number
  doctor_shedule_id: number | null
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  patient?: {
    id: number
    name: string
    last_name: string | null
    phone: string | null
  }
  doctor?: {
    id: number
    user?: {
      name: string
    }
    department?: {
      name: string
    }
    image?: string | null
  }
  payment?: Payment
  review?: {
    id: number
    rating: number
    comment: string | null
  } | null
}


