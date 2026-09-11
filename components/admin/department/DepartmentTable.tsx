"use client"

import { useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
    DialogFooter,
} from "@/components/ui/dialog"
import { DepartmentForm } from "./department-form"
import { updateDepartment } from "@/services/departmentService"
import { Department } from "@/types/department"

interface DepartmentTableProps {
    departments: Department[]
    onDelete: (id: number) => void
    onUpdated: () => void
}

export function DepartmentTable({ departments, onDelete, onUpdated }: DepartmentTableProps) {
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
    const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleConfirmDelete = async () => {
        if (!deletingDepartment) return
        setDeleteLoading(true)
        try {
            await onDelete(deletingDepartment.id)
            setDeletingDepartment(null)
            toast.success("Department deleted successfully")   // 👈 ye add karein
        } catch (err) {
            toast.error("Failed to delete department")          // 👈 ye bhi add karein
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <>
            <Table className="border border-[#42182b]/20">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold text-white">Name</TableHead>
                        <TableHead className="font-semibold text-white">Description</TableHead>
                        <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {departments.map((department) => (
                        <TableRow key={department.id}>
                            <TableCell className="font-medium">{department.name}</TableCell>
                            <TableCell>{department.description || "—"}</TableCell>
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
                                            className='cursor-pointer'
                                            onClick={() => setEditingDepartment(department)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className='cursor-pointer'
                                            variant="destructive"
                                            onClick={() => setDeletingDepartment(department)}
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

                open={!!editingDepartment}
                onOpenChange={(open) => !open && setEditingDepartment(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                    </DialogHeader>

                    {editingDepartment && (
                        <DepartmentForm
                            initialData={{
                                name: editingDepartment.name,
                                description: editingDepartment.description ?? "",
                            }}
                            onSubmit={async (data) => {
                                await updateDepartment(editingDepartment.id, data)
                            }}
                            onSuccess={() => {
                                setEditingDepartment(null)
                                onUpdated()
                                toast.success("Department updated successfully")
                            }}
                            mode="edit"
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingDepartment}
                onOpenChange={(open) => !open && setDeletingDepartment(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        This action cannot be undone. The department{" "}
                        <span className="font-medium text-foreground">
                            "{deletingDepartment?.name}"
                        </span>{" "}
                        will be permanently deleted.
                    </p>

                    <DialogFooter className="pt-4">
                        <Button
                            className='cursor-pointer'
                            variant="outline"
                            onClick={() => setDeletingDepartment(null)}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className='cursor-pointer'
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    )
}