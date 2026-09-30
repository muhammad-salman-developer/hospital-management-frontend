"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import api from "@/lib/axios"
import { Doctor } from "@/types/doctor"
import { DoctorSchedule } from "@/types/doctorSchedule"
import DoctorCard from "@/components/web/doctors/DoctorCard"
import BookingModal from "@/components/web/doctors/BookingModal"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? ""

export function DoctorsSection() {
    const { user } = useAuth()
    const router = useRouter()

    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [schedulesByDoctor, setSchedulesByDoctor] = useState<Record<number, DoctorSchedule[]>>({})
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null)
    const [loading, setLoading] = useState(true)
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

                const featured = doctorsData.slice(0, 6)

                setDoctors(featured)

                const scheduleResults = await Promise.all(
                    featured.map((doc) =>
                        api
                            .get("/doctor-shedules", {
                                params: { doctor_id: doc.id },
                            })
                            .then((res) => ({
                                doctorId: doc.id,
                                schedules: (res.data.data ?? []) as DoctorSchedule[],
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

    return (
        <section className="relative overflow-hidden bg-[#071E2B] py-20 sm:py-24">
            <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-[#36B9A6]/5 blur-3xl" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                            Our Team
                        </span>

                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Meet Our Doctors
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                            Meet our qualified healthcare professionals and
                            find the right doctor for your healthcare needs.
                        </p>
                    </div>

                    <Link
                        href="/doctors"
                        className="hidden items-center gap-1 text-sm text-slate-300 transition-colors hover:text-[#36B9A6] sm:inline-flex"
                    >
                        View all doctors
                        <ArrowUpRight className="size-4" />
                    </Link>
                </div>

                {/* ================= LOADING ================= */}
                {loading ? (
                    <div className="flex gap-5 overflow-hidden">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="h-[470px] w-72 shrink-0 animate-pulse rounded-2xl bg-white/5"
                            />
                        ))}
                    </div>
                ) : doctors.length === 0 ? (
                    <p className="py-10 text-sm text-slate-400">
                        Doctor profiles will appear here once added.
                    </p>
                ) : (

                    /* ================= DOCTOR CARDS ================= */
                    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 scrollbar-none">
                        {doctors.map((doctor, index) => (
                            <motion.div
                                key={doctor.id}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="w-72 shrink-0 snap-start"
                            >
                                <DoctorCard
                                    doctor={doctor}
                                    schedules={schedulesByDoctor[doctor.id] ?? []}
                                    onBook={openBookingModal}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ================= MOBILE VIEW ALL ================= */}
                <Link
                    href="/doctors"
                    className="mt-6 inline-flex items-center gap-1 text-sm text-slate-300 transition-colors hover:text-[#36B9A6] sm:hidden"
                >
                    View all doctors
                    <ArrowUpRight className="size-4" />
                </Link>
            </div>

            {/* ================= BOOKING MODAL ================= */}
            <BookingModal
                isOpen={isBookingModalOpen}
                doctor={selectedDoctor}
                schedules={selectedDoctor ? schedulesByDoctor[selectedDoctor.id] ?? [] : []}
                selectedSchedule={selectedSchedule}
                onSelectSchedule={setSelectedSchedule}
                onClose={closeBookingModal}
                onConfirm={handleBookingConfirm}
            />
        </section>
    )
}