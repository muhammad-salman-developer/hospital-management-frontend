"use client"

import { useState, useEffect } from "react"
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
import { Gender } from "@/types/patient"

interface PatientFormData {
  name: string
  phone: string
  last_name: string
  cnic: string
  date_of_birth: string
  gender: Gender | ""
  address: string
}

interface PatientFormProps {
  initialData?: Partial<PatientFormData>
  onSubmit: (data: PatientFormData) => Promise<void>
  onSuccess: () => void
  mode?: "create" | "edit"
}

const DEFAULT_FORM: PatientFormData = {
  name: "",
  phone: "",
  last_name: "",
  cnic: "",
  date_of_birth: "",
  gender: "",
  address: "",
}

export function PatientForm({
  initialData = DEFAULT_FORM,
  onSubmit,
  onSuccess,
  mode = "create",
}: PatientFormProps) {
  const [form, setForm] = useState<PatientFormData>({
    ...DEFAULT_FORM,
    ...initialData,
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm({ ...DEFAULT_FORM, ...initialData })
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string[]> = {}

    if (!form.name) newErrors.name = ["Name is required."]
    if (!form.last_name) newErrors.last_name = ["Last name is required."]
    if (!form.cnic) newErrors.cnic = ["CNIC is required."]
    if (!form.date_of_birth) newErrors.date_of_birth = ["Date of birth is required."]
    if (!form.gender) newErrors.gender = ["Gender is required."]
    if (!form.address) newErrors.address = ["Address is required."]

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
      : "Adding..."
    : mode === "edit"
      ? "Update"
      : "Add"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">First Name</Label>
          <Input
            id="name"
            autoComplete="off"
            className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            autoComplete="off"
            className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            autoComplete="off"
            className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnic">CNIC</Label>
          <Input
            id="cnic"
            placeholder="XXXXX-XXXXXXX-X"
            autoComplete="off"
            className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
            value={form.cnic}
            onChange={(e) => setForm({ ...form, cnic: e.target.value })}
          />
          {errors.cnic && (
            <p className="text-sm text-red-500">{errors.cnic[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({ ...form, date_of_birth: e.target.value })
            }
          />
          {errors.date_of_birth && (
            <p className="text-sm text-red-500">{errors.date_of_birth[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(value) =>
              setForm({ ...form, gender: value as Gender })
            }
          >
            <SelectTrigger id="gender" className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          autoComplete="off"
          className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address[0]}</p>
        )}
      </div>

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