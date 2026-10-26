
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            My Schedule
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your availability and timings.
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            if (!value) setEditingSchedule(null)
          }}
        >
          <DialogTrigger
            render={
              <Button
                className="cursor-pointer bg-[#42182b] p-5 hover:bg-[#361221]"
                onClick={handleAddClick}
              >
                <PlusIcon className="size-4" />
                Add Schedule
              </Button>
            }
          />

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? "Edit My Schedule" : "Add My Schedule"}
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
                    ? "Schedule updated successfully"
                    : "Schedule added successfully"
                )
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Card className="border-none bg-[#361221] p-3 text-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
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
