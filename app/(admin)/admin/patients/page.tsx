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

import { PatientTable } from "@/components/admin/patient/patient-table"
import { PatientForm } from "@/components/admin/patient/patient-form"
import { usePatients } from "@/hooks/usePatients"
import { createOrUpdatePatientProfile } from "@/services/patientService"

export default function PatientsPage() {
  const { patients, loading, error, fetchPatients, removePatient } = usePatients()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage patient records — both online and walk-in.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5">
                <PlusIcon className="size-4" />
                Add Patient
              </Button>
            }
          />
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Patient (Walk-in)</DialogTitle>
            </DialogHeader>
            <PatientForm
              mode="create"
              onSubmit={async (data) => {
                await createOrUpdatePatientProfile(data)
              }}
              onSuccess={() => {
                setOpen(false)
                fetchPatients()
                toast.success("Patient added successfully")
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
            <PatientTable
              patients={patients}
              onDelete={removePatient}
              onUpdated={fetchPatients}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}