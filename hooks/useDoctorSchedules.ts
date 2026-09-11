"use client"

import { useState, useCallback } from "react"
import {
  getDoctorSchedules,
  deleteDoctorSchedule,
} from "@/services/doctorScheduleService"
import { DoctorSchedule } from "@/types/doctorSchedule"

export function useDoctorSchedules(doctorId?: number) {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDoctorSchedules = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await getDoctorSchedules(doctorId)
      setSchedules(res.data.data)
    } catch (err) {
      console.error(err)
      setError("Failed to load doctor schedules.")
    } finally {
      setLoading(false)
    }
  }, [doctorId])

  const removeDoctorSchedule = useCallback(async (id: number) => {
    try {
      await deleteDoctorSchedule(id)
      setSchedules((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error(err)
      setError("Failed to delete doctor schedule.")
    }
  }, [])

  return {
    doctorSchedules: schedules,
    loading,
    error,
    fetchDoctorSchedules,
    removeDoctorSchedule,
  }
}