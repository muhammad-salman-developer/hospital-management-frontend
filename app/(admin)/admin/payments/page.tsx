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

import { PaymentTable } from "@/components/admin/payment/payment-table"
import { PaymentForm } from "@/components/admin/payment/payment-form"
import { usePayments } from "@/hooks/usePayments"
import { createPayment } from "@/services/paymentService"

export default function PaymentsPage() {
    const { payments, loading, error, fetchPayments, removePayment } = usePayments()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchPayments()
    }, [fetchPayments])

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage patient payments.
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger
                        render={
                            <Button className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5">
                                <PlusIcon className="size-4" />
                                Record Payment
                            </Button>
                        }
                    />
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                        </DialogHeader>
                        <PaymentForm
                            mode="create"
                            onSubmit={async (data) => {
                                await createPayment({
                                    appointment_id: Number(data.appointment_id),
                                    patient_id: Number(data.patient_id),
                                    amount: data.amount,
                                    status: data.status,
                                    notes: data.notes,
                                })
                            }}
                            onSuccess={() => {
                                setOpen(false)
                                fetchPayments()
                                toast.success("Payment recorded successfully")
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

            <Card className="bg-[#361221] text-white border-none p-3">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-6 space-y-3">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <PaymentTable
                            payments={payments}
                            onDelete={removePayment}
                            onUpdated={fetchPayments}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}