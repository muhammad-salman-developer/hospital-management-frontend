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
import { useDepartments } from "@/hooks/useDepartments"
type DoctorStatus = "active" | "inactive" | "on_leave"
interface DoctorFormData {
    name: string
    email: string
    password?: string
    department_id: string
    qualification: string
    specialization: string
    consultation_fee: string
    status: DoctorStatus
    image?: File | null
}

interface DoctorFormProps {
    initialData?: Partial<DoctorFormData>
    onSubmit: (data: FormData) => Promise<void>
    onSuccess: () => void
    mode?: "create" | "edit"
}

const DEFAULT_FORM: DoctorFormData = {
    name: "",
    email: "",
    password: "",
    department_id: "",
    qualification: "",
    specialization: "",
    consultation_fee: "",
    status: "active",
    image: null,
}

export function DoctorForm({
    initialData = DEFAULT_FORM,
    onSubmit,
    onSuccess,
    mode = "create",
}: DoctorFormProps) {
    const { departments, fetchDepartments } = useDepartments()

    const [form, setForm] = useState<DoctorFormData>({ ...DEFAULT_FORM, ...initialData })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchDepartments()
    }, [fetchDepartments])

    useEffect(() => {
        setForm({ ...DEFAULT_FORM, ...initialData })
    }, [initialData])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setForm({ ...form, image: file })
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            const formData = new FormData()
            formData.append("name", form.name)
            formData.append("email", form.email)
            if (form.password) {
                formData.append("password", form.password)
            }
            formData.append("department_id", form.department_id)
            formData.append("qualification", form.qualification)
            formData.append("specialization", form.specialization)
            formData.append("consultation_fee", form.consultation_fee)
            formData.append("status", form.status)
            if (form.image) {
                formData.append("image", form.image)
            }

            await onSubmit(formData)
            onSuccess()
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            }
        } finally {
            setLoading(false)
        }
    }

    const buttonText = loading
        ? mode === "edit" ? "Updating..." : "Adding..."
        : mode === "edit" ? "Update" : "Add"

    return (
 <form onSubmit={handleSubmit} className="space-y-4">
    
    {/* Row 1: Name + Email */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Doctor Name</Label>
        <Input
          id="name"
          autoComplete="off"
          className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="off"
          className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
      </div>
    </div>

    {/* Row 2: Password + Department */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="password">
          Password {mode === "edit" && <span className="text-muted-foreground text-xs">(optional)</span>}
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="off"
          className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department_id">Department</Label>
        <Select
          value={form.department_id}
          onValueChange={(value) => setForm({ ...form, department_id: value as DoctorStatus})}
        >
          <SelectTrigger className="w-full focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50">
            <SelectValue placeholder="Select a department">
              {departments.find((d) => String(d.id) === form.department_id)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={String(dept.id)}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department_id && <p className="text-sm text-red-500">{errors.department_id[0]}</p>}
      </div>
    </div>

    {/* Row 3: Qualification + Specialization */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="qualification">Qualification</Label>
        <Input
          id="qualification"
          autoComplete="off"
          className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
          value={form.qualification}
          onChange={(e) => setForm({ ...form, qualification: e.target.value })}
        />
        {errors.qualification && <p className="text-sm text-red-500">{errors.qualification[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          autoComplete="off"
          className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
        />
        {errors.specialization && <p className="text-sm text-red-500">{errors.specialization[0]}</p>}
      </div>
    </div>

    {/* Row 4: Consultation Fee + Status */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="consultation_fee">Consultation Fee</Label>
        <Input
          id="consultation_fee"
          type="number"
          step="0.01"
          autoComplete="off"
          className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
          value={form.consultation_fee}
          onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })}
        />
        {errors.consultation_fee && <p className="text-sm text-red-500">{errors.consultation_fee[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => setForm({ ...form, status: value as DoctorStatus })}
        >
          <SelectTrigger className="w-full focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Image Upload - Full Width */}
    <div className="space-y-2">
      <Label htmlFor="image">Profile Image</Label>
      <Input
        id="image"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
        onChange={handleImageChange}
      />
      {errors.image && <p className="text-sm text-red-500">{errors.image[0]}</p>}

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mt-2 size-20 rounded-md object-cover border"
        />
      )}
    </div>

    <div className="flex justify-end gap-2 pt-2">
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