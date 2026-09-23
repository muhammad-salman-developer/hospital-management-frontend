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
import { PatientForm } from "@/components/admin/patient/patient-form"
import { updatePatientProfile } from "@/services/patientService"
import { Patient } from "@/types/patient"

interface PatientTableProps {
    patients: Patient[]
    onDelete: (id: number) => Promise<void>
    onUpdated: () => void
}

export function PatientTable({ patients, onDelete, onUpdated }: PatientTableProps) {
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
    const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleConfirmDelete = async () => {
        if (!deletingPatient) return
        setDeleteLoading(true)
        try {
            await onDelete(deletingPatient.id)
            setDeletingPatient(null)
            toast.success("Patient deleted successfully")
        } catch (err) {
            toast.error("Failed to delete patient")
        } finally {
            setDeleteLoading(false)
        }
    }

    if (patients.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10">
                No patients found.
            </div>
        )
    }

    return (
        <>
            <Table className="border border-[#42182b]/20">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold text-white">Name</TableHead>
                        <TableHead className="font-semibold text-white">Phone</TableHead>
                        <TableHead className="font-semibold text-white">CNIC</TableHead>
                        <TableHead className="font-semibold text-white">Gender</TableHead>
                        <TableHead className="font-semibold text-white">Date of Birth</TableHead>
                        <TableHead className="font-semibold text-white">Source</TableHead>
                        <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.map((patient) => (
                        <TableRow key={patient.id}>
                            <TableCell className="font-medium">
                                {patient.name} {patient.last_name ?? ""}
                            </TableCell>
                            <TableCell>
                                {patient.phone ?? patient.user?.phone_number ?? "—"}
                            </TableCell>
                            <TableCell>{patient.cnic ?? "—"}</TableCell>
                            <TableCell className="capitalize">
                                {patient.gender ?? "—"}
                            </TableCell>
                            <TableCell>{patient.date_of_birth ?? "—"}</TableCell>
                            <TableCell>
                                <Badge variant={patient.user_id ? "default" : "secondary"}>
                                    {patient.user_id ? "Online" : "Walk-in"}
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
                                            onClick={() => setEditingPatient(patient)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            variant="destructive"
                                            onClick={() => setDeletingPatient(patient)}
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
                open={!!editingPatient}
                onOpenChange={(open) => !open && setEditingPatient(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Patient</DialogTitle>
                    </DialogHeader>

                    {editingPatient && (
                        <PatientForm
                            mode="edit"
                            initialData={{
                                name: editingPatient.name,
                                last_name: editingPatient.last_name ?? "",
                                phone: editingPatient.phone ?? "",
                                cnic: editingPatient.cnic ?? "",
                                date_of_birth: editingPatient.date_of_birth ?? "",
                                gender: editingPatient.gender ?? "",
                                address: editingPatient.address ?? "",
                            }}
                            onSubmit={async (data) => {
                                await updatePatientProfile(editingPatient.id, data)
                            }}
                            onSuccess={() => {
                                setEditingPatient(null)
                                onUpdated()
                                toast.success("Patient updated successfully")
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingPatient}
                onOpenChange={(open) => !open && setDeletingPatient(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Patient{" "}
                        <span className="font-medium text-foreground">
                            {deletingPatient?.name} {deletingPatient?.last_name}
                        </span>{" "}
                        will be permanently deleted.
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setDeletingPatient(null)}
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