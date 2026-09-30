"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import api from "@/lib/axios"
import { Doctor } from "@/types/doctor"
import { DoctorSchedule } from "@/types/doctorSchedule"
import DoctorCard from "@/components/web/doctors/DoctorCard"
import BookingModal from "@/components/web/doctors/BookingModal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
export default function DoctorsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [schedulesByDoctor, setSchedulesByDoctor] = useState<Record<number, DoctorSchedule[]>>({})
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [selectedSchedule, setSelectedSchedule] =
        useState<DoctorSchedule | null>(null)
    const [booking, setBooking] = useState(false)
    const [bookingError, setBookingError] = useState("")

    const openBookingModal = (doctor: Doctor) => {
        if (!user) {
            router.push("/login")
            return
        }
        setSelectedDoctor(doctor)
        setSelectedSchedule(null)
        setBookingError("")
        setIsBookingModalOpen(true)
    }

    const closeBookingModal = () => {
        setIsBookingModalOpen(false)
        setSelectedDoctor(null)
        setSelectedSchedule(null)
        setBookingError("")
    }

    // ================= CONFIRM BOOKING =================
    const handleBookingConfirm = async (patientId: number, appointmentDate: string) => {
        if (!selectedDoctor || !selectedSchedule) return

        setBooking(true)
        setBookingError("")

        try {
            const res = await api.post("/appointments", {
                patient_id: patientId,
                doctor_id: selectedDoctor.id,
                doctor_shedule_id: selectedSchedule.id,
                appointment_date: appointmentDate,
                appointment_time: selectedSchedule.start_time,
            })

            closeBookingModal()
            toast.success("Appointment booked successfully!")
        } catch (error: any) {
            console.error("Failed to create appointment:", error)
            const message = error?.response?.data?.message ?? "Failed to book appointment. Please try again."
            setBookingError(message)
            toast.error(message)
        } finally {
            setBooking(false)
        }
    }

    useEffect(() => {
        const fetchDoctorsAndSchedules = async () => {
            try {
                const doctorsRes = await api.get("/doctors")

                const doctorsData: Doctor[] =
                    doctorsRes.data.data?.data ?? doctorsRes.data.data ?? []

                setDoctors(doctorsData)

                const scheduleResults = await Promise.all(
                    doctorsData.map((doc) =>
                        api
                            .get("/doctor-shedules", {
                                params: { doctor_id: doc.id },
                            })
                            .then((res) => ({
                                doctorId: doc.id,
                                schedules: (res.data.data ??
                                    []) as DoctorSchedule[],
                            }))
                            .catch(() => ({
                                doctorId: doc.id,
                                schedules: [] as DoctorSchedule[],
                            }))
                    )
                )

                const map: Record<number, DoctorSchedule[]> = {}
                scheduleResults.forEach((result) => {
                    map[result.doctorId] = result.schedules.filter(
                        (schedule) => schedule.is_available
                    )
                })

                setSchedulesByDoctor(map)
            } catch (error) {
                console.error("Failed to fetch doctors:", error)
                setDoctors([])
            } finally {
                setLoading(false)
            }
        }

        fetchDoctorsAndSchedules()
    }, [])

    // ================= CATEGORY LIST (unique departments) =================
    const categories = useMemo(() => {
        const unique = new Map<string, string>()
        doctors.forEach((doc) => {
            if (doc.department?.name) {
                unique.set(doc.department.name, doc.department.name)
            }
        })
        return Array.from(unique.values())
    }, [doctors])

    // ================= FILTERED DOCTORS =================
    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor) => {
            const matchesSearch =
                searchTerm.trim() === "" ||
                doctor.user?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                doctor.specialization
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())

            const matchesCategory =
                selectedCategory === "all" ||
                doctor.department?.name === selectedCategory

            return matchesSearch && matchesCategory
        })
    }, [doctors, searchTerm, selectedCategory])

    return (
        <section className="min-h-screen bg-[#071E2B] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-10 text-center">
                    <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                        Our Team
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Find Your Doctor
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                        Search by name or filter by category to find the
                        right specialist for you.
                    </p>
                </div>

                {/* ================= SEARCH + FILTER ================= */}
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by doctor name or specialization..."
                            className="w-full rounded-full border border-white/10 bg-[#082C3C] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[#36B9A6]/50"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory("all")}
                            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${selectedCategory === "all"
                                ? "border-[#36B9A6] bg-[#36B9A6]/10 text-[#6ED6C5]"
                                : "border-white/10 text-slate-400 hover:border-[#36B9A6]/40"
                                }`}
                        >
                            All
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setSelectedCategory(category)}
                                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors ${selectedCategory === category
                                    ? "border-[#36B9A6] bg-[#36B9A6]/10 text-[#6ED6C5]"
                                    : "border-white/10 text-slate-400 hover:border-[#36B9A6]/40"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ================= LOADING ================= */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="h-[470px] animate-pulse rounded-2xl bg-white/5"
                            />
                        ))}
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <p className="py-16 text-center text-sm text-slate-400">
                        No doctors found matching your search.
                    </p>
                ) : (

                    /* ================= DOCTOR GRID ================= */
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                schedules={schedulesByDoctor[doctor.id] ?? []}
                                onBook={openBookingModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ================= BOOKING MODAL ================= */}
            <BookingModal
                isOpen={isBookingModalOpen}
                doctor={selectedDoctor}
                schedules={
                    selectedDoctor
                        ? schedulesByDoctor[selectedDoctor.id] ?? []
                        : []
                }
                selectedSchedule={selectedSchedule}
                onSelectSchedule={setSelectedSchedule}
                onClose={closeBookingModal}
                onConfirm={handleBookingConfirm}
            />
        </section>
    )
}