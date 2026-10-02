"use client"

import { useState, useCallback } from "react"
import { getAppointments, deleteAppointment } from "@/services/appointmentService"
import { Appointment } from "@/types/appointment"

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAppointments()
      // result = { current_page, data: [...], ... } (pagination object)
      setAppointments(result?.data ?? [])
    } catch (err) {
      console.error(err)
      setError("Failed to load appointments.")
    } finally {
      setLoading(false)
    }
  }, [])

  const removeAppointment = useCallback(async (id: number) => {
    await deleteAppointment(id)
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    removeAppointment,
  }
}