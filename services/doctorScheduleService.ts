import api from "@/lib/axios"
import { DayOfWeek } from "@/types/doctorSchedule"

export const getDoctorSchedules = (doctorId?: number) =>
    api.get("/doctor-shedules", {
        params: doctorId ? { doctor_id: doctorId } : {},
    })

export const createDoctorSchedule = (data: {
    doctor_id: number
    day: DayOfWeek
    start_time: string
    end_time: string
    is_available: boolean
}) => api.post("/doctor-shedules", data)

export const updateDoctorSchedule = (
    id: number,
    data: {
        doctor_id: number
        day: DayOfWeek
        start_time: string
        end_time: string
        is_available: boolean
    }
) => api.put(`/doctor-shedules/${id}`, data)

export const deleteDoctorSchedule = (id: number) =>
    api.delete(`/doctor-shedules/${id}`)