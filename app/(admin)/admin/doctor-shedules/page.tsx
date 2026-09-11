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

import { DoctorScheduleTable } from "@/components/admin/schedule/doctor-schedule-table"
import { DoctorScheduleForm } from "@/components/admin/schedule/doctor-schedule-form"

import { useDoctorSchedules } from "@/hooks/useDoctorSchedules"
import {
  createDoctorSchedule,
  updateDoctorSchedule,
} from "@/services/doctorScheduleService"
import { DoctorSchedule } from "@/types/doctorSchedule"

export default function DoctorSchedulesPage() {
  const {
    doctorSchedules,
    loading,
    error,
    fetchDoctorSchedules,
    removeDoctorSchedule,
  } = useDoctorSchedules()

  const [open, setOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] =
    useState<DoctorSchedule | null>(null)

  useEffect(() => {
    fetchDoctorSchedules()
  }, [fetchDoctorSchedules])

  const handleAddClick = () => {
    setEditingSchedule(null)
    setOpen(true)
  }

  const handleEditClick = (schedule: DoctorSchedule) => {
    setEditingSchedule(schedule)
    setOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Doctor Schedule
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage doctor schedules and timings.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5"
                onClick={handleAddClick}
              >
                <PlusIcon className="size-4" />
                Add Schedule
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? "Edit Doctor Schedule" : "Add Doctor Schedule"}
              </DialogTitle>
            </DialogHeader>
            <DoctorScheduleForm
              mode={editingSchedule ? "edit" : "create"}
              initialData={
                editingSchedule
                  ? {
                      doctor_id: String(editingSchedule.doctor_id),
                      day: editingSchedule.day,
                      start_time: editingSchedule.start_time,
                      end_time: editingSchedule.end_time,
                      is_available: editingSchedule.is_available,
                    }
                  : undefined
              }
              onSubmit={async (data) => {
                if (editingSchedule) {
                  await updateDoctorSchedule(editingSchedule.id, data)
                } else {
                  await createDoctorSchedule(data)
                }
              }}
              onSuccess={() => {
                setOpen(false)
                setEditingSchedule(null)
                fetchDoctorSchedules()
                toast.success(
                  editingSchedule
                    ? "Doctor schedule updated successfully"
                    : "Doctor schedule added successfully"
                )
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
            <DoctorScheduleTable
              doctorSchedules={doctorSchedules}
              onDelete={removeDoctorSchedule}
              onUpdated={fetchDoctorSchedules}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}