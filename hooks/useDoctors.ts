"use client"

import { useState, useCallback } from "react"
import { getDoctors, deleteDoctor } from "@/services/doctorService"
import { Doctor } from "@/types/doctor"

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchDoctors = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await getDoctors()
      setDoctors(res.data.data.data)   // paginate() ka nested structure
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [])

  const removeDoctor = async (id: number) => {
    await deleteDoctor(id)
    fetchDoctors()   // Soft delete hai, is liye status update dekhne k liye refetch behtar hai
  }

  return { doctors, loading, error, fetchDoctors, removeDoctor }
}