"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PaymentStatus } from "@/types/payment"
import { useAppointments } from "@/hooks/useAppointment"

interface PaymentFormData {
    appointment_id: string
    patient_id: string
    amount: string
    status: PaymentStatus | ""
    paid_at: string
    notes: string
}

interface PaymentFormProps {
    initialData?: Partial<PaymentFormData>
    onSubmit: (data: PaymentFormData) => Promise<void>
    onSuccess: () => void
    mode?: "create" | "edit"
}

const DEFAULT_FORM: PaymentFormData = {
    appointment_id: "",
    patient_id: "",
    amount: "",
    status: "paid",
    paid_at: "",
    notes: "",
}

export function PaymentForm({
    initialData = DEFAULT_FORM,
    onSubmit,
    onSuccess,
    mode = "create",
}: PaymentFormProps) {
    const [form, setForm] = useState<PaymentFormData>({
        ...DEFAULT_FORM,
        ...initialData,
    })

    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)

    const {
        appointments,
        loading: appointmentsLoading,
        fetchAppointments,
    } = useAppointments()

    useEffect(() => {
        setForm({
            ...DEFAULT_FORM,
            ...initialData,
        })
    }, [initialData])

    // Load appointments in both create and edit mode
    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    const selectedAppointment = appointments.find(
        (appointment) =>
            appointment.id.toString() === form.appointment_id
    )

    const validate = () => {
        const newErrors: Record<string, string[]> = {}

        if (!form.appointment_id) {
            newErrors.appointment_id = ["Appointment is required."]
        }

        if (!form.patient_id) {
            newErrors.patient_id = ["Patient is required."]
        }

        if (!form.amount) {
            newErrors.amount = ["Amount is required."]
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleAppointmentChange = (appointmentId: string) => {
        const appointment = appointments.find(
            (item) => item.id.toString() === appointmentId
        )

        setForm((prev) => ({
            ...prev,
            appointment_id: appointmentId,
            patient_id: appointment?.patient_id?.toString() ?? "",
        }))

        setErrors((prev) => ({
            ...prev,
            appointment_id: [],
            patient_id: [],
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setLoading(true)

        try {
            await onSubmit(form)
            onSuccess()
        } catch (err: any) {
            if (
                err.response?.status === 422 &&
                err.response.data?.errors
            ) {
                setErrors(err.response.data.errors)
            }
        } finally {
            setLoading(false)
        }
    }

    const buttonText = loading
        ? mode === "edit"
            ? "Updating..."
            : "Recording..."
        : mode === "edit"
            ? "Update Payment"
            : "Record Payment"

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Appointment + Patient */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Appointment */}
                <div className="space-y-2">
                    <Label htmlFor="appointment_id">
                        Appointment
                    </Label>

                    <Select
                        value={form.appointment_id}
                        onValueChange={handleAppointmentChange}
                        disabled={
                            mode === "edit" ||
                            appointmentsLoading
                        }
                    >
                        <SelectTrigger
                            id="appointment_id"
                            className="w-full focus:border-[#42182b] focus:ring-[#42182b]/50"
                        >
                            <SelectValue
                                placeholder={
                                    appointmentsLoading
                                        ? "Loading appointments..."
                                        : "Select appointment"
                                }
                            />
                        </SelectTrigger>

                        <SelectContent>
                            {appointments
                                .filter(
                                    (appointment) =>
                                        appointment.status !== "cancelled"
                                )
                                .map((appointment) => (
                                    <SelectItem
                                        key={appointment.id}
                                        value={appointment.id.toString()}
                                    >
                                        {appointment.doctor?.user?.name ??
                                            "Unknown Doctor"}{" "}
                                        —{" "}
                                        {appointment.appointment_date}{" "}
                                        at{" "}
                                        {appointment.appointment_time}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    {errors.appointment_id && (
                        <p className="text-sm text-red-500">
                            {errors.appointment_id[0]}
                        </p>
                    )}
                </div>

                {/* Patient */}
                <div className="space-y-2">
                    <Label htmlFor="patient">
                        Patient
                    </Label>

                    <Input
                        id="patient"
                        value={
                            selectedAppointment?.patient?.name ??
                            ""
                        }
                        placeholder={
                            appointmentsLoading
                                ? "Loading..."
                                : "Patient"
                        }
                        readOnly
                        className="bg-muted/30 focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50"
                    />

                    {errors.patient_id && (
                        <p className="text-sm text-red-500">
                            {errors.patient_id[0]}
                        </p>
                    )}
                </div>
            </div>

            {/* Amount + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Amount */}
                <div className="space-y-2">
                    <Label htmlFor="amount">
                        Amount
                    </Label>

                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={form.amount}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                amount: e.target.value,
                            })
                        }
                        className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
                    />

                    {errors.amount && (
                        <p className="text-sm text-red-500">
                            {errors.amount[0]}
                        </p>
                    )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label htmlFor="status">
                        Status
                    </Label>

                    <Select
                        value={form.status}
                        onValueChange={(value) =>
                            setForm({
                                ...form,
                                status: value as PaymentStatus,
                            })
                        }
                    >
                        <SelectTrigger
                            id="status"
                            className="w-full"
                        >
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="paid">
                                Paid
                            </SelectItem>

                            <SelectItem value="pending_verification">
                                Pending Verification
                            </SelectItem>

                            <SelectItem value="unpaid">
                                Unpaid
                            </SelectItem>

                            <SelectItem value="failed">
                                Failed
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.status && (
                        <p className="text-sm text-red-500">
                            {errors.status[0]}
                        </p>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <Label htmlFor="notes">
                    Notes (optional)
                </Label>

                <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            notes: e.target.value,
                        })
                    }
                    placeholder="e.g. discount applied, partial payment"
                />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5"
                >
                    {buttonText}
                </Button>
            </div>
        </form>
    )
}

