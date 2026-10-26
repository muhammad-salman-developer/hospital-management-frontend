"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { AppointmentTable } from "@/components/admin/appointment/appointment-table";
import { AppointmentForm } from "@/components/admin/appointment/appointment-form";
import { useAppointments } from "@/hooks/useAppointment";
import { createAppointment } from "@/services/appointmentService";

export default function ReceptionAppointmentsPage() {
    const {
        appointments,
        loading,
        error,
        fetchAppointments,
        removeAppointment,
    } = useAppointments();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#361221]">
                        Appointments
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage patient appointments and bookings.
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger
                        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#42182b] hover:bg-[#361221] transition-colors"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Book Appointment
                    </DialogTrigger>

                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Book Appointment</DialogTitle>
                        </DialogHeader>

                        <AppointmentForm
                            mode="create"
                            onSubmit={async (data) => {
                                await createAppointment({
                                    patient_id: Number(data.patient_id),
                                    doctor_id: Number(data.doctor_id),
                                    appointment_date: data.appointment_date,
                                    appointment_time: data.appointment_time,
                                    amount: 0,
                                });
                            }}
                            onSuccess={() => {
                                setOpen(false);
                                fetchAppointments();
                                toast.success("Appointment booked successfully");
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {typeof error === "string" ? error : "Failed to load appointments."}
                </p>
            )}

            <Card className="bg-[#361221] text-white border-none p-3">
                <CardContent className="p-6">
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton key={index} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <AppointmentTable
                            appointments={appointments}
                            onDelete={removeAppointment}
                            onUpdated={fetchAppointments}
                            basePath="/reception/appointments"
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}