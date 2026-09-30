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
import { PaymentForm } from "@/components/admin/payment/payment-form"
import { updatePayment } from "@/services/paymentService"
import { Payment } from "@/types/payment"

interface PaymentTableProps {
    payments: Payment[]
    onDelete: (id: number) => Promise<void>
    onUpdated: () => void
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    paid: "default",
    pending: "secondary",
    refunded: "destructive",
}

export function PaymentTable({ payments, onDelete, onUpdated }: PaymentTableProps) {
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
    const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleConfirmDelete = async () => {
        if (!deletingPayment) return
        setDeleteLoading(true)
        try {
            await onDelete(deletingPayment.id)
            setDeletingPayment(null)
            toast.success("Payment deleted successfully")
        } catch (err) {
            toast.error("Failed to delete payment")
        } finally {
            setDeleteLoading(false)
        }
    }

    if (payments.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10">
                No payments found.
            </div>
        )
    }

    return (
        <>
            <Table className="border border-[#42182b]/20">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold text-white">Patient</TableHead>
                        <TableHead className="font-semibold text-white">Doctor</TableHead>
                        <TableHead className="font-semibold text-white">Appointment Date</TableHead>
                        <TableHead className="font-semibold text-white">Amount</TableHead>
                        <TableHead className="font-semibold text-white">Status</TableHead>
                        <TableHead className="font-semibold text-white">Paid At</TableHead>
                        <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                                {payment.patient?.name ?? "—"} {payment.patient?.last_name ?? ""}
                            </TableCell>
                            <TableCell>
                                {payment.appointment?.doctor?.user?.name ?? "—"}
                            </TableCell>
                            <TableCell>{payment.appointment?.appointment_date ?? "—"}</TableCell>
                            <TableCell>Rs. {payment.amount}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[payment.status] ?? "secondary"} className="capitalize">
                                    {payment.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {payment.paid_at ? new Date(payment.paid_at).toLocaleString() : "—"}
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
                                            onClick={() => setEditingPayment(payment)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            variant="destructive"
                                            onClick={() => setDeletingPayment(payment)}
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
                open={!!editingPayment}
                onOpenChange={(open) => !open && setEditingPayment(null)}
            >
                <DialogContent
                    className="sm:max-w-2xl overflow-y-auto"
                >
                    <DialogHeader>
                        <DialogTitle>Edit Payment</DialogTitle>
                    </DialogHeader>

                    {editingPayment && (
                        <PaymentForm
                            mode="edit"
                            initialData={{
                                appointment_id: String(editingPayment.appointment_id),
                                patient_id: String(editingPayment.patient_id),
                                amount: String(editingPayment.amount),
                                status: editingPayment.status,
                                notes: editingPayment.notes ?? "",
                            }}
                            onSubmit={async (data) => {
                                await updatePayment(editingPayment.id, {
                                    amount: data.amount,
                                    status: data.status,
                                    notes: data.notes,
                                })
                            }}
                            onSuccess={() => {
                                setEditingPayment(null)
                                onUpdated()
                                toast.success("Payment updated successfully")
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingPayment}
                onOpenChange={(open) => !open && setDeletingPayment(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Payment record of{" "}
                        <span className="font-medium text-foreground">
                            Rs. {deletingPayment?.amount}
                        </span>{" "}
                        for{" "}
                        <span className="font-medium text-foreground">
                            {deletingPayment?.patient?.name}
                        </span>{" "}
                        will be permanently deleted.
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setDeletingPayment(null)}
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