"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
import { Card, CardContent } from "@/components/ui/card"

import { useAuth } from "@/hooks/useAuth"
import {
  createOrUpdatePatientProfile,
  getPatients,
  Gender,
} from "@/services/patientService"

interface PatientFormData {
  name: string
  phone: string
  last_name: string
  cnic: string
  date_of_birth: string
  gender: Gender | ""
  address: string
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

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user } = useAuth()

  const [form, setForm] = useState<PatientFormData>(DEFAULT_FORM)
  const [patientId, setPatientId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Agar profile pehle se bani hui hai to load kar ke form pre-fill karein,
  // warna user ke naam/phone se defaults bhar dein
  useEffect(() => {
    const fetchExisting = async () => {
      if (!user?.id) {
        setFetching(false)
        return
      }

      try {
        const res = await getPatients()
        const existing = res.data.data?.data?.find(
          (p: any) => p.user_id === user.id
        )

        if (existing) {
          setPatientId(existing.id)
          setForm({
            name: existing.name ?? user.name ?? "",
            phone: existing.phone ?? user.phone_number ?? "",
            last_name: existing.last_name ?? "",
            cnic: existing.cnic ?? "",
            date_of_birth: existing.date_of_birth ?? "",
            gender: existing.gender ?? "",
            address: existing.address ?? "",
          })
        } else {
          setForm((prev) => ({
            ...prev,
            name: user.name ?? "",
            phone: user.phone_number ?? "",
          }))
        }
      } catch (err) {
        setForm((prev) => ({
          ...prev,
          name: user.name ?? "",
          phone: user.phone_number ?? "",
        }))
      } finally {
        setFetching(false)
      }
    }

    fetchExisting()
  }, [user])

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

    if (!user?.id) {
      toast.error("You must be logged in to complete your profile.")
      return
    }

    if (!validate()) return

    setLoading(true)

    try {
      await createOrUpdatePatientProfile({
        user_id: user.id,
        ...form,
      })

      toast.success("Profile completed successfully!")
      router.push("/patient/dashboard")
    } catch (err: any) {
      const backendErrors = err.response?.data?.errors
      if (err.response?.status === 422 && backendErrors) {
        setErrors(backendErrors)
      } else {
        toast.error(err.response?.data?.message || "Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {patientId ? "Update Your Profile" : "Complete Your Profile"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Please provide the following details to continue.
            </p>
          </div>

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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5"
            >
              {loading
                ? "Saving..."
                : patientId
                  ? "Update Profile"
                  : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}