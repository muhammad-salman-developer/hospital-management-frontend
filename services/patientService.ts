import api from "@/lib/axios"

export type Gender = "male" | "female" | "other"

export interface PatientProfileData {
  user_id?: number | null
  name: string
  phone?: string
  last_name?: string
  cnic?: string
  date_of_birth?: string
  gender?: Gender | ""
  address?: string
}

export const getPatients = () => api.get("/patients")

export const getPatient = (id: number) => api.get(`/patients/${id}`)

export const createOrUpdatePatientProfile = (data: PatientProfileData) =>
  api.post("/patients", data)

export const updatePatientProfile = (id: number, data: PatientProfileData) =>
  api.put(`/patients/${id}`, data)

export const deletePatientProfile = (id: number) =>
  api.delete(`/patients/${id}`)

export const getDoctorPatients = async () => {
  const res = await api.get("/doctor/patients")
  return res.data.data
}