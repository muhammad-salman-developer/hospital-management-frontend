"use client"

import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { DoctorTable } from "@/components/admin/doctor/doctor-table"
import { DoctorForm } from "@/components/admin/doctor/doctor-form"
import { useDoctors } from "@/hooks/useDoctors"
import { createDoctor } from "@/services/doctorService"

export default function DoctorsPage() {
  const { doctors, loading, error, fetchDoctors, removeDoctor } = useDoctors()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Doctors</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage hospital doctors and their details.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5">
                <PlusIcon className="size-4" />
                Add Doctor
              </Button>
            }
          />
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Doctor</DialogTitle>
            </DialogHeader>
            <DoctorForm
              mode="create"
              onSubmit={async (formData) => {
                await createDoctor(formData)
              }}
              onSuccess={() => {
                setOpen(false)
                fetchDoctors()
                toast.success("Doctor added successfully")
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Content */}
      <Card className="bg-[#361221] text-white border-none p-3">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DoctorTable
              doctors={doctors}
              onDelete={removeDoctor}
              onUpdated={fetchDoctors}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}