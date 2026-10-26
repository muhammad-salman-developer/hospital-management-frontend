"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  CreditCard,
  Clock,
  UserPlus,
  CalendarPlus,
  ArrowRight,
} from "lucide-react";

import { usePatients } from "@/hooks/usePatients";
import { useAppointments } from "@/hooks/useAppointment";

export default function ReceptionDashboard() {
  const {
    patients,
    loading: patientsLoading,
    fetchPatients,
  } = usePatients();

  const {
    appointments,
    loading: appointmentsLoading,
    fetchAppointments,
  } = useAppointments();

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, [fetchPatients, fetchAppointments]);

  const loading = patientsLoading || appointmentsLoading;

  const stats = [
    {
      title: "Total Patients",
      value: patients?.length ?? 0,
      description: "Registered patient records",
      icon: Users,
    },
    {
      title: "Appointments",
      value: appointments?.length ?? 0,
      description: "Scheduled appointments",
      icon: CalendarDays,
    },
    {
      title: "Total Payments",
      value: 0,
      description: "Payment records",
      icon: CreditCard,
    },
    {
      title: "Pending Payments",
      value: 0,
      description: "Payments awaiting collection",
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#361221]">
          Reception Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage patients, appointments and payments.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-[#42182b]/20 bg-[#361221] p-5 shadow-sm transition hover:bg-[#42182b]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white/80">
                {item.title}
              </p>

              <div className="rounded-lg bg-white/10 p-2">
                <item.icon className="size-5 text-white" />
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-white">
              {loading &&
              (item.title === "Total Patients" ||
                item.title === "Appointments")
                ? "..."
                : item.value}
            </p>

            <p className="mt-1 text-xs text-white/60">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#361221]">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/reception/patient"
            className="flex items-center justify-between rounded-xl border border-[#42182b]/20 bg-[#361221] p-5 transition hover:bg-[#42182b]"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/10 p-3">
                <UserPlus className="size-6 text-white" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Add Patient
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  Register a new walk-in patient
                </p>
              </div>
            </div>

            <ArrowRight className="size-5 text-white/70" />
          </Link>

          <Link
            href="/reception/appointments"
            className="flex items-center justify-between rounded-xl border border-[#42182b]/20 bg-[#361221] p-5 transition hover:bg-[#42182b]"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/10 p-3">
                <CalendarPlus className="size-6 text-white" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Book Appointment
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  Schedule an appointment for a patient
                </p>
              </div>
            </div>

            <ArrowRight className="size-5 text-white/70" />
          </Link>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="rounded-xl border border-[#42182b]/20 bg-[#361221] p-6">
        <h2 className="text-lg font-semibold text-white">
          Welcome to HMS Reception
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/70">
          Manage patient records and appointments from your reception
          dashboard. Statistics update when the dashboard fetches the
          latest records from the API.
        </p>
      </div>
    </div>
  );
}