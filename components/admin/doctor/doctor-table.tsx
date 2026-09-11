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
import { DoctorForm } from "@/components/admin/doctor/doctor-form"
import { updateDoctor } from "@/services/doctorService"
import { Doctor } from "@/types/doctor"

interface DoctorTableProps {
    doctors: Doctor[]
    onDelete: (id: number) => void
    onUpdated: () => void
}

export function DoctorTable({ doctors, onDelete, onUpdated }: DoctorTableProps) {
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
    const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleConfirmDelete = async () => {
        if (!deletingDoctor) return
        setDeleteLoading(true)
        try {
            await onDelete(deletingDoctor.id)
            setDeletingDoctor(null)
            toast.success("Doctor deactivated successfully")
        } catch (err) {
            toast.error("Failed to deactivate doctor")
        } finally {
            setDeleteLoading(false)
        }
    }

    if (doctors.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10">
                No doctors found.
            </div>
        )
    }

    return (
        <>
            <Table className="border border-[#42182b]/20">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold text-white">Name</TableHead>
                        <TableHead className="font-semibold text-white">Email</TableHead>
                        <TableHead className="font-semibold text-white">Department</TableHead>
                        <TableHead className="font-semibold text-white">Specialization</TableHead>
                        <TableHead className="font-semibold text-white">Qualification</TableHead>
                        <TableHead className="font-semibold text-white">Fee</TableHead>
                        <TableHead className="font-semibold text-white">Image</TableHead>
                        <TableHead className="font-semibold text-white">Status</TableHead>
                        <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {doctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                            <TableCell className="font-medium">{doctor.user.name}</TableCell>
                            <TableCell>{doctor.user.email}</TableCell>
                            <TableCell>{doctor.department?.name || "—"}</TableCell>
                            <TableCell>{doctor.specialization}</TableCell>
                            <TableCell>{doctor.qualification || "—"}</TableCell>
                            <TableCell>{doctor.consultation_fee}</TableCell>
                            <TableCell>
                                {doctor.image_url ? (
                                    <img
                                        src={doctor.image_url}
                                        alt={doctor.user.name}
                                        className="size-10 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                        {doctor.user.name.charAt(0)}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                                    {doctor.status}
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
                                            onClick={() => setEditingDoctor(doctor)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            variant="destructive"
                                            onClick={() => setDeletingDoctor(doctor)}
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
                open={!!editingDoctor}
                onOpenChange={(open) => !open && setEditingDoctor(null)}
            >
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Doctor</DialogTitle>
                    </DialogHeader>

                    {editingDoctor && (
                        <DoctorForm
                            mode="edit"
                            initialData={{
                                name: editingDoctor.user.name,
                                email: editingDoctor.user.email,
                                department_id: String(editingDoctor.department_id),
                                qualification: editingDoctor.qualification,
                                specialization: editingDoctor.specialization,
                                consultation_fee: editingDoctor.consultation_fee,
                                status: editingDoctor.status,
                            }}
                            onSubmit={async (formData) => {
                                await updateDoctor(editingDoctor.id, formData)
                            }}
                            onSuccess={() => {
                                setEditingDoctor(null)
                                onUpdated()
                                toast.success("Doctor updated successfully")
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingDoctor}
                onOpenChange={(open) => !open && setDeletingDoctor(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Doctor{" "}
                        <span className="font-medium text-foreground">
                            {deletingDoctor?.user.name}
                        </span>{" "}
                        will be marked as inactive.
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setDeletingDoctor(null)}
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