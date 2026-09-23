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

import { AppointmentTable } from "@/components/admin/appointment/appointment-table"
import { AppointmentForm } from "@/components/admin/appointment/appointment-form"
import { useAppointments } from "@/hooks/useAppointment"
import { createAppointment } from "@/services/appointmentService"

export default function AppointmentsPage() {
  const { appointments, loading, error, fetchAppointments, removeAppointment } =
    useAppointments()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage patient appointments.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5">
                <PlusIcon className="size-4" />
                Book Appointment
              </Button>
            }
          />
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
            </DialogHeader>
            <AppointmentForm
              mode="create"
              onSubmit={async (data) => {
                await createAppointment({
                  patient_id: Number(data.patient_id),
                  doctor_id: Number(data.doctor_id),
                  appointment_date: data.appointment_date,
                  appointment_time: data.appointment_time,
                  amount: 0,
                })
              }}
              onSuccess={() => {
                setOpen(false)
                fetchAppointments()
                toast.success("Appointment booked successfully")
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
            <AppointmentTable
              appointments={appointments}
              onDelete={removeAppointment}
              onUpdated={fetchAppointments}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}