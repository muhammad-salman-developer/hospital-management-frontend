"use client"

import { useEffect, useState } from "react"
import {
    X,
    Calendar,
    Clock,
    Stethoscope,
    User,
    Plus,
    ChevronLeft,
} from "lucide-react"
import { Doctor } from "@/types/doctor"
import { DoctorSchedule } from "@/types/doctorSchedule"
import { DAY_SHORT, STORAGE_URL } from "@/lib/constants"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"

interface Patient {
    id: number
    user_id: number | null
    name: string
    last_name?: string | null
    phone?: string | null
    cnic?: string | null
    date_of_birth?: string | null
    gender?: "male" | "female" | "other" | null
    address?: string | null
}

interface BookingModalProps {
    isOpen: boolean
    doctor: Doctor | null
    schedules: DoctorSchedule[]
    selectedSchedule: DoctorSchedule | null
    onSelectSchedule: (schedule: DoctorSchedule) => void
    onClose: () => void
    onConfirm: (patientId: number, date: string) => void
}

export default function BookingModal({
    isOpen,
    doctor,
    schedules,
    selectedSchedule,
    onSelectSchedule,
    onClose,
    onConfirm,
}: BookingModalProps) {
    const { user } = useAuth()

    const [step, setStep] = useState<"patient" | "schedule">("patient")

    const [patients, setPatients] = useState<Patient[]>([])
    const [loadingPatients, setLoadingPatients] = useState(false)
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)

    const [appointmentDate, setAppointmentDate] = useState("")

    const [showAddForm, setShowAddForm] = useState(false)
    const [addingPatient, setAddingPatient] = useState(false)
    const [addError, setAddError] = useState("")

    const [newPatient, setNewPatient] = useState({
        name: "",
        last_name: "",
        phone: "",
        cnic: "",
        date_of_birth: "",
        gender: "",
        address: "",
    })

    useEffect(() => {
        if (!isOpen || !user) return

        const fetchPatients = async () => {
            setLoadingPatients(true)

            try {
                const res = await api.get("/my-patients")

                const list: Patient[] = res.data.data ?? []

                setPatients(list)

                if (list.length > 0) {
                    setSelectedPatientId(list[0].id)
                }
            } catch (error) {
                console.error("Failed to fetch patients:", error)
                setPatients([])
            } finally {
                setLoadingPatients(false)
            }
        }

        fetchPatients()

        setStep("patient")
        setShowAddForm(false)
        setAddError("")
        setAppointmentDate("")
    }, [isOpen, user])

    if (!isOpen || !doctor) return null

    if (!user) {
        console.log("appointmentDate:", appointmentDate)
        console.log("selectedSchedule:", selectedSchedule)
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <div
                    className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#082C3C] p-6 text-center shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="text-sm text-slate-300">
                        Please log in to book an appointment.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            onClose()
                            window.location.href = "/login"
                        }}
                        className="mt-4 w-full rounded-full bg-[#36B9A6] py-2.5 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5]"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    // ================= ADD NEW PATIENT =================

    const handleAddPatient = async () => {
        if (!newPatient.name.trim()) return

        setAddingPatient(true)
        setAddError("")

        try {
            const res = await api.post("/patients", {
                user_id: user.id,
                name: newPatient.name,
                last_name: newPatient.last_name || undefined,
                phone: newPatient.phone || undefined,
                cnic: newPatient.cnic || undefined,
                date_of_birth: newPatient.date_of_birth || undefined,
                gender: newPatient.gender || undefined,
                address: newPatient.address || undefined,
            })

            const created: Patient = res.data.data

            setPatients((prev) => [...prev, created])
            setSelectedPatientId(created.id)
            setShowAddForm(false)

            setNewPatient({
                name: "",
                last_name: "",
                phone: "",
                cnic: "",
                date_of_birth: "",
                gender: "",
                address: "",
            })
        } catch (error: any) {
            console.error("Failed to add patient:", error)

            setAddError(
                error?.response?.data?.message ??
                "Failed to save patient. Please try again."
            )
        } finally {
            setAddingPatient(false)
        }
    }

    const handleClose = () => {
        setStep("patient")
        setShowAddForm(false)
        setSelectedPatientId(null)
        setAppointmentDate("")
        onClose()
    }

    const handleConfirm = () => {
        if (!selectedPatientId || !appointmentDate) return

        onConfirm(selectedPatientId, appointmentDate)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#082C3C] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}

                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
                >
                    <X className="size-4" />
                </button>

                {/* Doctor Header */}

                <div className="flex items-center gap-4 border-b border-white/10 bg-[#0B3445] p-5">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#082C3C]">
                        {doctor.image ? (
                            <img
                                src={`${STORAGE_URL}/storage/${doctor.image}`}
                                alt={doctor.user?.name ?? "Doctor"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Stethoscope className="size-6 text-[#36B9A6]/40" />
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-white">
                            {doctor.user?.name ?? "Doctor"}
                        </h3>

                        <p className="text-sm text-[#36B9A6]">
                            {doctor.specialization}
                        </p>
                    </div>
                </div>

                <div className="max-h-[70vh] overflow-y-auto p-5">

                    {/* ================= PATIENT STEP ================= */}

                    {step === "patient" && (
                        <>
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Who is this appointment for?
                            </p>

                            {loadingPatients ? (
                                <div className="space-y-2">
                                    {[...Array(2)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-14 animate-pulse rounded-xl bg-white/5"
                                        />
                                    ))}
                                </div>
                            ) : !showAddForm ? (
                                <div className="flex flex-col gap-2">

                                    {patients.map((patient) => (
                                        <button
                                            key={patient.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedPatientId(patient.id)
                                            }
                                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${selectedPatientId === patient.id
                                                ? "border-[#36B9A6] bg-[#36B9A6]/10 text-white"
                                                : "border-white/10 bg-white/5 text-slate-300 hover:border-[#36B9A6]/40"
                                                }`}
                                        >
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#36B9A6]/10">
                                                <User className="size-4 text-[#36B9A6]" />
                                            </div>

                                            <div>
                                                <p className="font-medium">
                                                    {patient.name}{" "}
                                                    {patient.last_name ?? ""}
                                                </p>

                                                {patient.phone && (
                                                    <p className="text-xs text-slate-400">
                                                        {patient.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    ))}

                                    {/* Add New Patient */}

                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(true)}
                                        className="flex items-center gap-3 rounded-xl border border-dashed border-white/20 px-4 py-3 text-left text-sm text-slate-400 transition-colors hover:border-[#36B9A6]/40 hover:text-[#6ED6C5]"
                                    >
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                                            <Plus className="size-4" />
                                        </div>

                                        Add New Patient
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">

                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="mb-1 flex items-center gap-1 text-xs text-slate-400 hover:text-[#36B9A6]"
                                    >
                                        <ChevronLeft className="size-3.5" />
                                        Back to list
                                    </button>

                                    {addError && (
                                        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                                            {addError}
                                        </p>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="Full Name *"
                                        value={newPatient.name}
                                        onChange={(e) =>
                                            setNewPatient({
                                                ...newPatient,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#36B9A6]/50"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={newPatient.phone}
                                        onChange={(e) =>
                                            setNewPatient({
                                                ...newPatient,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#36B9A6]/50"
                                    />

                                    <div className="grid grid-cols-2 gap-3">

                                        <input
                                            type="date"
                                            value={newPatient.date_of_birth}
                                            onChange={(e) =>
                                                setNewPatient({
                                                    ...newPatient,
                                                    date_of_birth: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#36B9A6]/50"
                                        />

                                        <select
                                            value={newPatient.gender}
                                            onChange={(e) =>
                                                setNewPatient({
                                                    ...newPatient,
                                                    gender: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#36B9A6]/50"
                                        >
                                            <option
                                                value=""
                                                className="bg-[#082C3C]"
                                            >
                                                Gender
                                            </option>

                                            <option
                                                value="male"
                                                className="bg-[#082C3C]"
                                            >
                                                Male
                                            </option>

                                            <option
                                                value="female"
                                                className="bg-[#082C3C]"
                                            >
                                                Female
                                            </option>

                                            <option
                                                value="other"
                                                className="bg-[#082C3C]"
                                            >
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            !newPatient.name.trim() ||
                                            addingPatient
                                        }
                                        onClick={handleAddPatient}
                                        className="mt-1 w-full rounded-full bg-[#36B9A6] py-2.5 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {addingPatient
                                            ? "Saving..."
                                            : "Save Patient"}
                                    </button>
                                </div>
                            )}

                            {!showAddForm && (
                                <button
                                    type="button"
                                    disabled={!selectedPatientId}
                                    onClick={() => setStep("schedule")}
                                    className="mt-5 w-full rounded-full bg-[#36B9A6] py-3 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Continue
                                </button>
                            )}
                        </>
                    )}

                    {/* ================= DATE & SCHEDULE STEP ================= */}

                    {step === "schedule" && (
                        <>
                            <button
                                type="button"
                                onClick={() => setStep("patient")}
                                className="mb-4 flex items-center gap-1 text-xs text-slate-400 hover:text-[#36B9A6]"
                            >
                                <ChevronLeft className="size-3.5" />
                                Change patient
                            </button>

                            {/* Appointment Date */}

                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Select Appointment Date
                            </p>

                            <div className="relative">
                                <Calendar className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#36B9A6]" />

                                <input
                                    type="date"
                                    value={appointmentDate}
                                    onChange={(e) =>
                                        setAppointmentDate(e.target.value)
                                    }
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#36B9A6]/50"
                                />
                            </div>

                            {/* Doctor Schedule */}

                            {appointmentDate && (
                                <div className="mt-5">

                                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                        Doctor's Schedule
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        {schedules.length === 0 ? (
                                            <p className="text-sm text-slate-400">
                                                No schedule available for this
                                                doctor right now.
                                            </p>
                                        ) : (
                                            schedules.map((schedule) => (
                                                <button
                                                    key={schedule.id}
                                                    type="button"
                                                    onClick={() =>
                                                        onSelectSchedule(
                                                            schedule
                                                        )
                                                    }
                                                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${selectedSchedule?.id ===
                                                        schedule.id
                                                        ? "border-[#36B9A6] bg-[#36B9A6]/10 text-white"
                                                        : "border-white/10 bg-white/5 text-slate-300 hover:border-[#36B9A6]/40"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="size-4 text-[#36B9A6]" />

                                                        {DAY_SHORT[
                                                            schedule.day
                                                        ] ?? schedule.day}
                                                    </span>

                                                    {(schedule.start_time ||
                                                        schedule.end_time) && (
                                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                                <Clock className="size-3.5" />

                                                                {
                                                                    schedule.start_time
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    schedule.end_time
                                                                }
                                                            </span>
                                                        )}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Fee */}

                            <div className="mt-5 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                                <span className="text-xs uppercase tracking-wider text-slate-500">
                                    Consultation fee
                                </span>

                                <span className="text-sm font-semibold text-white">
                                    Rs. {doctor.consultation_fee}
                                </span>
                            </div>

                            {/* Confirm */}

                            <button
                                type="button"
                                disabled={
                                    !appointmentDate ||
                                    !selectedSchedule
                                }
                                onClick={handleConfirm}
                                className="mt-5 w-full rounded-full bg-[#36B9A6] py-3 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Confirm Appointment
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}