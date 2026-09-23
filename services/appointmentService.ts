import api from "@/lib/axios"
import { AppointmentStatus, PaymentMethod } from "@/types/appointment"

export interface AppointmentData {
  patient_id: number
  doctor_id: number
  doctor_shedule_id?: number | null
  appointment_date: string
  appointment_time: string
  amount: number
  method?: PaymentMethod | ""
}

export interface AppointmentUpdateData {
  appointment_date?: string
  appointment_time?: string
  status?: AppointmentStatus
}

export const getAppointments = () => api.get("/appointments")

export const getAppointment = (id: number) => api.get(`/appointments/${id}`)

export const createAppointment = (data: AppointmentData) =>
  api.post("/appointments", data)

export const updateAppointment = (id: number, data: AppointmentUpdateData) =>
  api.put(`/appointments/${id}`, data)

export const deleteAppointment = (id: number) =>
  api.delete(`/appointments/${id}`)

// Payment actions (appointment_id based)
export const submitTransaction = (
  appointmentId: number,
  data: { method: "jazzcash" | "easypaisa"; transaction_id: string }
) => api.post(`/appointments/${appointmentId}/submit-transaction`, data)

export const markAsPaid = (appointmentId: number) =>
  api.post(`/appointments/${appointmentId}/mark-paid`)

export const verifyPayment = (appointmentId: number) =>
  api.post(`/appointments/${appointmentId}/verify`)

export const rejectPayment = (appointmentId: number) =>
  api.post(`/appointments/${appointmentId}/reject`)