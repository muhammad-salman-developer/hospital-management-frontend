"use client"

import { useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DoctorScheduleForm } from "@/components/admin/schedule/doctor-schedule-form"
import { updateDoctorSchedule } from "@/services/doctorScheduleService"
import { DoctorSchedule } from "@/types/doctorSchedule"

interface DoctorScheduleTableProps {
    doctorSchedules: DoctorSchedule[]
    onDelete: (id: number) => Promise<void>
    onUpdated: () => void
}

export function DoctorScheduleTable({
    doctorSchedules,
    onDelete,
    onUpdated,
}: DoctorScheduleTableProps) {
    const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(null)
    const [deletingSchedule, setDeletingSchedule] = useState<DoctorSchedule | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleConfirmDelete = async () => {
        if (!deletingSchedule) return
        setDeleteLoading(true)
        try {
            await onDelete(deletingSchedule.id)
            setDeletingSchedule(null)
            toast.success("Schedule deleted successfully")
        } catch (err) {
            toast.error("Failed to delete schedule")
        } finally {
            setDeleteLoading(false)
        }
    }

    if (doctorSchedules.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10">
                No doctor schedules found.
            </div>
        )
    }

    return (
        <>
            <Table className="border border-[#42182b]/20">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold text-white">Doctor</TableHead>
                        {/* <TableHead className="font-semibold text-white">Department</TableHead> */}
                        <TableHead className="font-semibold text-white">Day</TableHead>
                        <TableHead className="font-semibold text-white">Start Time</TableHead>
                        <TableHead className="font-semibold text-white">End Time</TableHead>
                        <TableHead className="font-semibold text-white">Status</TableHead>
                        <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {doctorSchedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                            <TableCell className="font-medium">
                                {schedule.doctor?.user?.name ?? "—"}
                            </TableCell>
                            {/* <TableCell>
                                {schedule.doctor?.department?.name ?? "—"}
                            </TableCell> */}
                            <TableCell className="capitalize">{schedule.day}</TableCell>
                            <TableCell>{schedule.start_time}</TableCell>
                            <TableCell>{schedule.end_time}</TableCell>
                            <TableCell>
                                <Badge variant={schedule.is_available ? "default" : "secondary"}>
                                    {schedule.is_available ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
                                                <MoreHorizontalIcon className="size-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        }
                                    />
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => setEditingSchedule(schedule)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            variant="destructive"
                                            onClick={() => setDeletingSchedule(schedule)}
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit Dialog */}
            <Dialog
                open={!!editingSchedule}
                onOpenChange={(open) => !open && setEditingSchedule(null)}
            >
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Schedule</DialogTitle>
                    </DialogHeader>

                    {editingSchedule && (
                        <DoctorScheduleForm
                            mode="edit"
                            initialData={{
                                doctor_id: String(editingSchedule.doctor_id),
                                day: editingSchedule.day,
                                start_time: editingSchedule.start_time,
                                end_time: editingSchedule.end_time,
                                is_available: editingSchedule.is_available,
                            }}
                            onSubmit={async (data) => {
                                await updateDoctorSchedule(editingSchedule.id, data)
                            }}
                            onSuccess={() => {
                                setEditingSchedule(null)
                                onUpdated()
                                toast.success("Schedule updated successfully")
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingSchedule}
                onOpenChange={(open) => !open && setDeletingSchedule(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        The schedule for{" "}
                        <span className="font-medium text-foreground">
                            {deletingSchedule?.doctor?.user?.name ?? "this doctor"}
                        </span>{" "}
                        on{" "}
                        <span className="font-medium text-foreground capitalize">
                            {deletingSchedule?.day}
                        </span>{" "}
                        will be permanently deleted.
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setDeletingSchedule(null)}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}