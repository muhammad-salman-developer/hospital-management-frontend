"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Stethoscope,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { getAppointment } from "@/services/appointmentService"
import { Appointment } from "@/types/appointment"

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive"
> = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
}

export default function AppointmentViewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await getAppointment(Number(id))
        setAppointment(res.data.data)
      } catch (err) {
        setError("Failed to load appointment details.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAppointment()
  }, [id])

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Appointment Details
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            View complete appointment information
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer w-fit bg-[#361221] text-white p-5 hover:bg-[#42182b] hover:text-white"
          onClick={() => router.push("/admin/appointments")}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Appointments
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>

            <CardContent className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <Card className="max-w-4xl">
          <CardContent className="p-6">
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          </CardContent>
        </Card>
      ) : appointment ? (
        <div className="max-w-4xl space-y-6">

          {/* Appointment Summary */}
          <Card className="bg-[#361221] text-white border-[#361221]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg text-white">
                  Appointment #{appointment.id}
                </CardTitle>

                <p className="text-sm text-white/70 mt-1">
                  Appointment information
                </p>
              </div>

              <Badge
                variant={
                  statusVariant[appointment.status] ?? "secondary"
                }
                className="capitalize px-3 py-1"
              >
                {appointment.status}
              </Badge>
            </CardHeader>
          </Card>

          {/* Patient & Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Patient */}
            <Card className="bg-[#361221] text-white border-[#361221]">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <User className="size-5 text-white/70" />
                  Patient Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div>
                  <p className="text-xs text-white/60 mb-1">
                    Name
                  </p>

                  <p className="font-medium text-white">
                    {appointment.patient?.name ?? "—"}{" "}
                    {appointment.patient?.last_name ?? ""}
                  </p>
                </div>

                {appointment.patient?.phone && (
                  <div>
                    <p className="text-xs text-white/60 mb-1">
                      Phone
                    </p>

                    <p className="font-medium text-white">
                      {appointment.patient.phone}
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Doctor */}
            <Card className="bg-[#361221] text-white border-[#361221]">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Stethoscope className="size-5 text-white/70" />
                  Doctor Information
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div>
                  <p className="text-xs text-white/60 mb-1">
                    Name
                  </p>

                  <p className="font-medium text-white">
                    {appointment.doctor?.user?.name ?? "—"}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Appointment Timing */}
          <Card className="bg-[#361221] text-white border-[#361221]">
            <CardHeader>
              <CardTitle className="text-base text-white">
                Appointment Timing
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Date */}
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white/10 p-2">
                    <CalendarDays className="size-5 text-white/80" />
                  </div>

                  <div>
                    <p className="text-xs text-white/60">
                      Appointment Date
                    </p>

                    <p className="font-medium text-white">
                      {appointment.appointment_date}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white/10 p-2">
                    <Clock className="size-5 text-white/80" />
                  </div>

                  <div>
                    <p className="text-xs text-white/60">
                      Appointment Time
                    </p>

                    <p className="font-medium text-white">
                      {appointment.appointment_time}
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>
      ) : null}
    </div>
  )
}