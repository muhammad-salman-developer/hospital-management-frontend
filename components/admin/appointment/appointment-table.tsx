"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { AppointmentForm } from "@/components/admin/appointment/appointment-form"
import { updateAppointment } from "@/services/appointmentService"
import { Appointment } from "@/types/appointment"

interface AppointmentTableProps {
    appointments: Appointment[]
    onDelete: (id: number) => Promise<void>
    onUpdated: () => void
    basePath?: string
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    pending: "secondary",
    confirmed: "default",
    completed: "default",
    cancelled: "destructive",
}

export function AppointmentTable({
    appointments,
    onDelete,
    onUpdated,
    basePath = "/admin/appointments",
}: AppointmentTableProps) {
    const router = useRouter()

    const [editingAppointment, setEditingAppointment] =
        useState<Appointment | null>(null)
    const [deletingAppointment, setDeletingAppointment] =
        useState<Appointment | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleConfirmDelete = async () => {
        if (!deletingAppointment) return

        setDeleteLoading(true)

        try {
            await onDelete(deletingAppointment.id)
            setDeletingAppointment(null)
            toast.success("Appointment deleted successfully")
        } catch {
            toast.error("Failed to delete appointment")
        } finally {
            setDeleteLoading(false)
        }
    }

    if (appointments.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10">
                No appointments found.
            </div>
        )
    }

    return (
        <>
            <Table className="border border-[#42182b]/20">
                <TableHeader>
                    <TableRow className="bg-[#361221] hover:bg-[#361221]">
                        <TableHead className="font-semibold text-white">Patient</TableHead>
                        <TableHead className="font-semibold text-white">Doctor</TableHead>
                        <TableHead className="font-semibold text-white">Date</TableHead>
                        <TableHead className="font-semibold text-white">Time</TableHead>
                        <TableHead className="font-semibold text-white">Status</TableHead>
                        <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell className="font-medium">
                                {appointment.patient?.name ?? "—"}{" "}
                                {appointment.patient?.last_name ?? ""}
                            </TableCell>

                            <TableCell>
                                {appointment.doctor?.user?.name ?? "—"}
                            </TableCell>

                            <TableCell>{appointment.appointment_date}</TableCell>
                            <TableCell>{appointment.appointment_time}</TableCell>

                            <TableCell>
                                <Badge
                                    variant={
                                        statusVariant[appointment.status] ?? "secondary"
                                    }
                                    className="capitalize"
                                >
                                    {appointment.status}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 cursor-pointer"
                                            >
                                                <MoreHorizontalIcon className="size-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        }
                                    />

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() =>
                                                router.push(
                                                    `${basePath}/${appointment.id}`
                                                )
                                            }
                                        >
                                            View
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setEditingAppointment(appointment)
                                            }
                                        >
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            variant="destructive"
                                            onClick={() =>
                                                setDeletingAppointment(appointment)
                                            }
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
                open={!!editingAppointment}
                onOpenChange={(open) =>
                    !open && setEditingAppointment(null)
                }
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Appointment</DialogTitle>
                    </DialogHeader>

                    {editingAppointment && (
                        <AppointmentForm
                            mode="edit"
                            initialData={{
                                patient_id: String(editingAppointment.patient_id),
                                doctor_id: String(editingAppointment.doctor_id),
                                appointment_date:
                                    editingAppointment.appointment_date,
                                appointment_time:
                                    editingAppointment.appointment_time,
                                status: editingAppointment.status,
                            }}
                            onSubmit={async (data) => {
                                await updateAppointment(editingAppointment.id, {
                                    appointment_date: data.appointment_date,
                                    appointment_time: data.appointment_time,
                                    status: data.status as Appointment["status"],
                                })
                            }}
                            onSuccess={() => {
                                setEditingAppointment(null)
                                onUpdated()
                                toast.success("Appointment updated successfully")
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingAppointment}
                onOpenChange={(open) =>
                    !open && setDeletingAppointment(null)
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Appointment for{" "}
                        <span className="font-medium text-foreground">
                            {deletingAppointment?.patient?.name}
                        </span>{" "}
                        on{" "}
                        <span className="font-medium text-foreground">
                            {deletingAppointment?.appointment_date}
                        </span>{" "}
                        will be permanently deleted.
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setDeletingAppointment(null)}
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