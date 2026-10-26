
"use client"

import { useState, useCallback } from "react"
import {
    getPatients,
    getDoctorPatients,
    deletePatientProfile,
} from "@/services/patientService"
import { Patient } from "@/types/patient"

export function usePatients() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchPatients = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await getPatients()
            setPatients(res.data.data.data ?? res.data.data)
        } catch (err) {
            console.error(err)
            setError("Failed to load patients.")
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchDoctorPatients = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await getDoctorPatients()
            setPatients(Array.isArray(data) ? data : data?.data ?? [])
        } catch (err) {
            console.error(err)
            setError("Failed to load your patients.")
        } finally {
            setLoading(false)
        }
    }, [])

    const removePatient = useCallback(async (id: number) => {
        await deletePatientProfile(id)
        setPatients((prev) => prev.filter((p) => p.id !== id))
    }, [])

    return {
        patients,
        loading,
        error,
        fetchPatients,
        fetchDoctorPatients,
        removePatient,
    }
}
