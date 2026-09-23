export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"
export type PaymentMethod = "jazzcash" | "easypaisa" | "cash"
export type PaymentStatus = "unpaid" | "pending_verification" | "paid" | "failed"

export interface Payment {
  id: number
  appointment_id: number
  amount: string
  method: PaymentMethod | null
  transaction_id: string | null
  status: PaymentStatus
}

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
  }
  payment?: Payment
}