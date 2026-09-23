"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useDoctors } from "@/hooks/useDoctors"
import { usePatients } from "@/hooks/usePatients"
import { AppointmentStatus } from "@/types/appointment"

interface AppointmentFormData {
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus | ""
}

interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormData>
  onSubmit: (data: AppointmentFormData) => Promise<void>
  onSuccess: () => void
  mode?: "create" | "edit"
}

const DEFAULT_FORM: AppointmentFormData = {
  patient_id: "",
  doctor_id: "",
  appointment_date: "",
  appointment_time: "",
  status: "pending",
}

export function AppointmentForm({
  initialData = DEFAULT_FORM,
  onSubmit,
  onSuccess,
  mode = "create",
}: AppointmentFormProps) {
  const { doctors, fetchDoctors } = useDoctors()
  const { patients, fetchPatients } = usePatients()

  const [form, setForm] = useState<AppointmentFormData>({
    ...DEFAULT_FORM,
    ...initialData,
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDoctors()
    fetchPatients()
  }, [fetchDoctors, fetchPatients])

  useEffect(() => {
    setForm({ ...DEFAULT_FORM, ...initialData })
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string[]> = {}

    if (!form.patient_id) newErrors.patient_id = ["Patient is required."]
    if (!form.doctor_id) newErrors.doctor_id = ["Doctor is required."]
    if (!form.appointment_date) newErrors.appointment_date = ["Date is required."]
    if (!form.appointment_time) newErrors.appointment_time = ["Time is required."]

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      await onSubmit(form)
      onSuccess()
    } catch (err: any) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        setErrors(err.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const buttonText = loading
    ? mode === "edit"
      ? "Updating..."
      : "Booking..."
    : mode === "edit"
      ? "Update"
      : "Book Appointment"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient */}
      <div className="space-y-2">
        <Label htmlFor="patient_id">Patient</Label>
        <Select
          value={form.patient_id}
          onValueChange={(value) => setForm({ ...form, patient_id: value })}
          disabled={mode === "edit"}
        >
          <SelectTrigger id="patient_id" className="w-full">
            <SelectValue placeholder="Select a patient">
              {(() => {
                const selected = patients.find(
                  (p) => String(p.id) === form.patient_id
                )
                return selected
                  ? `${selected.name} ${selected.last_name ?? ""}`
                  : undefined
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={String(patient.id)}>
                {patient.name} {patient.last_name ?? ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.patient_id && (
          <p className="text-sm text-red-500">{errors.patient_id[0]}</p>
        )}
      </div>

      {/* Doctor */}
      <div className="space-y-2">
        <Label htmlFor="doctor_id">Doctor</Label>
        <Select
          value={form.doctor_id}
          onValueChange={(value) => setForm({ ...form, doctor_id: value })}
          disabled={mode === "edit"}
        >
          <SelectTrigger id="doctor_id" className="w-full">
            <SelectValue placeholder="Select a doctor">
              {doctors.find((d) => String(d.id) === form.doctor_id)?.user?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={String(doctor.id)}>
                {doctor.user?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.doctor_id && (
          <p className="text-sm text-red-500">{errors.doctor_id[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appointment_date">Date</Label>
          <Input
            id="appointment_date"
            type="date"
            className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
            value={form.appointment_date}
            onChange={(e) =>
              setForm({ ...form, appointment_date: e.target.value })
            }
          />
          {errors.appointment_date && (
            <p className="text-sm text-red-500">{errors.appointment_date[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment_time">Time</Label>
          <Input
            id="appointment_time"
            type="time"
            className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
            value={form.appointment_time}
            onChange={(e) =>
              setForm({ ...form, appointment_time: e.target.value })
            }
          />
          {errors.appointment_time && (
            <p className="text-sm text-red-500">{errors.appointment_time[0]}</p>
          )}
        </div>
      </div>

      {mode === "edit" && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.status}
            onValueChange={(value) =>
              setForm({ ...form, status: value as AppointmentStatus })
            }
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  )
}