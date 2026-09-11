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
import { DayOfWeek } from "@/types/doctorSchedule"

interface DoctorScheduleFormData {
  doctor_id: string
  day: DayOfWeek | ""
  start_time: string
  end_time: string
  is_available: boolean
}

interface DoctorScheduleFormProps {
  initialData?: Partial<DoctorScheduleFormData>
  onSubmit: (data: {
    doctor_id: number
    day: DayOfWeek
    start_time: string
    end_time: string
    is_available: boolean
  }) => Promise<void>
  onSuccess: () => void
  mode?: "create" | "edit"
}

const DEFAULT_FORM: DoctorScheduleFormData = {
  doctor_id: "",
  day: "",
  start_time: "",
  end_time: "",
  is_available: true,
}

export function DoctorScheduleForm({
  initialData = DEFAULT_FORM,
  onSubmit,
  onSuccess,
  mode = "create",
}: DoctorScheduleFormProps) {
  const { doctors, fetchDoctors } = useDoctors()

  const [form, setForm] = useState<DoctorScheduleFormData>({
    ...DEFAULT_FORM,
    ...initialData,
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  useEffect(() => {
    setForm({
      ...DEFAULT_FORM,
      ...initialData,
    })
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string[]> = {}

    if (!form.doctor_id) newErrors.doctor_id = ["Doctor is required."]
    if (!form.day) newErrors.day = ["Day is required."]
    if (!form.start_time) newErrors.start_time = ["Start time is required."]
    if (!form.end_time) newErrors.end_time = ["End time is required."]

    if (
      form.start_time &&
      form.end_time &&
      form.start_time >= form.end_time
    ) {
      newErrors.end_time = ["End time must be after start time."]
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      await onSubmit({
        doctor_id: Number(form.doctor_id),
        day: form.day as DayOfWeek,
        start_time: form.start_time,
        end_time: form.end_time,
        is_available: form.is_available,
      })

      onSuccess()
    } catch (err: unknown) {
      const anyErr = err as { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }

      if (anyErr.response?.status === 422 && anyErr.response.data?.errors) {
        setErrors(anyErr.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const buttonText = loading
    ? mode === "edit"
      ? "Updating..."
      : "Adding..."
    : mode === "edit"
      ? "Update"
      : "Add"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Doctor */}
      <div className="space-y-2">
        <Label htmlFor="doctor_id">
          Doctor
        </Label>

        <Select
          value={form.doctor_id}
          onValueChange={(value) =>
            setForm({
              ...form,
              doctor_id: value ,
            })
          }
        >
          <SelectTrigger id="doctor_id" className="w-full">
            <SelectValue placeholder="Select a doctor" />
          </SelectTrigger>

          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem
                key={doctor.id}
                value={String(doctor.id)}
              >
                {doctor.user?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.doctor_id && (
          <p className="text-sm text-red-500">
            {errors.doctor_id[0]}
          </p>
        )}
      </div>

      {/* Day */}
      <div className="space-y-2">
        <Label htmlFor="day">
          Day
        </Label>

        <Select
          value={form.day}
          onValueChange={(value) =>
            setForm({
              ...form,
              day: value as DayOfWeek,
            })
          }
        >
          <SelectTrigger id="day" className="w-full">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="monday">Monday</SelectItem>
            <SelectItem value="tuesday">Tuesday</SelectItem>
            <SelectItem value="wednesday">Wednesday</SelectItem>
            <SelectItem value="thursday">Thursday</SelectItem>
            <SelectItem value="friday">Friday</SelectItem>
            <SelectItem value="saturday">Saturday</SelectItem>
            <SelectItem value="sunday">Sunday</SelectItem>
          </SelectContent>
        </Select>

        {errors.day && (
          <p className="text-sm text-red-500">
            {errors.day[0]}
          </p>
        )}
      </div>

      {/* Start Time */}
      <div className="space-y-2">
        <Label htmlFor="start_time">
          Start Time
        </Label>

        <Input
          id="start_time"
          type="time"
          value={form.start_time}
          onChange={(e) =>
            setForm({
              ...form,
              start_time: e.target.value,
            })
          }
        />

        {errors.start_time && (
          <p className="text-sm text-red-500">
            {errors.start_time[0]}
          </p>
        )}
      </div>

      {/* End Time */}
      <div className="space-y-2">
        <Label htmlFor="end_time">
          End Time
        </Label>

        <Input
          id="end_time"
          type="time"
          value={form.end_time}
          onChange={(e) =>
            setForm({
              ...form,
              end_time: e.target.value,
            })
          }
        />

        {errors.end_time && (
          <p className="text-sm text-red-500">
            {errors.end_time[0]}
          </p>
        )}
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <Label htmlFor="is_available">
          Status
        </Label>

        <Select
          value={form.is_available ? "active" : "inactive"}
          onValueChange={(value) =>
            setForm({
              ...form,
              is_available: value === "active",
            })
          }
        >
          <SelectTrigger id="is_available" className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="active">
              Active
            </SelectItem>

            <SelectItem value="inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Button */}
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