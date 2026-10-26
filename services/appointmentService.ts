import api from "@/lib/axios"
import { AppointmentStatus, } from "@/types/appointment"

export interface AppointmentData {
  patient_id: number
  doctor_id: number
  doctor_shedule_id?: number | null
  appointment_date: string
  appointment_time: string
  amount: number
  // method?: PaymentMethod | ""
}

export interface AppointmentUpdateData {
  appointment_date?: string
  appointment_time?: string
  status?: AppointmentStatus
}

// ================= CORE CRUD =================

export async function getAppointments() {
  const res = await api.get("/appointments")
  return res.data.data
}

export async function getMyAppointments() {
  const res = await api.get("/my-appointments")
  return res.data.data
}

export async function getAppointment(id: number) {
  const res = await api.get(`/appointments/${id}`)
  return res.data.data
}

export async function createAppointment(data: AppointmentData) {
  const res = await api.post("/appointments", data)
  return res.data.data
}

export async function updateAppointment(id: number, data: AppointmentUpdateData) {
  const res = await api.put(`/appointments/${id}`, data)
  return res.data.data
}

export async function deleteAppointment(id: number) {
  const res = await api.delete(`/appointments/${id}`)
  return res.data
}
export async function getDoctorAppointments() {
  const res = await api.get("/doctor/appointments");
  return res.data.data;
}

// ================= PAYMENT ACTIONS (appointment_id based) =================

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
