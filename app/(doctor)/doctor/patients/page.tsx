
"use client"

import { useEffect } from "react"
import { RefreshCw, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePatients } from "@/hooks/usePatients"

export default function DoctorPatientsPage() {
    const {
        patients,
        loading,
        error,
        fetchDoctorPatients,
    } = usePatients()

    useEffect(() => {
        fetchDoctorPatients()
    }, [fetchDoctorPatients])

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#361221]">
                        My Patients
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Apni appointments se related patients ki details dekhein.
                    </p>
                </div>

                <Button
                    onClick={fetchDoctorPatients}
                    disabled={loading}
                    className="bg-[#361221] text-white hover:bg-[#42182b]"
                >
                    <RefreshCw className="mr-2 size-4" />
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <Card className="border-[#361221] bg-[#361221] text-white">
                <CardContent className="flex items-center justify-between p-5">
                    <div>
                        <p className="text-sm text-white/80">
                            My Total Patients
                        </p>

                        {loading ? (
                            <Skeleton className="mt-3 h-8 w-20" />
                        ) : (
                            <p className="mt-2 text-3xl font-bold">
                                {patients.length}
                            </p>
                        )}
                    </div>

                    <Users className="size-8 text-white/80" />
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-[#361221]">
                <div className="bg-[#361221] px-5 py-4 text-white">
                    <h2 className="font-semibold">Patient List</h2>
                </div>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="space-y-3 p-5">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="p-10 text-center">
                            <Users className="mx-auto size-10 text-gray-400" />
                            <p className="mt-3 font-medium text-[#361221]">
                                No patients found
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Abhi aapki appointments se related koi patient nahi mila.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-[#361221]">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">#</th>
                                        <th className="px-4 py-3 font-semibold">Patient Name</th>
                                        <th className="px-4 py-3 font-semibold">Email</th>
                                        <th className="px-4 py-3 font-semibold">Phone</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {patients.map((patient, index) => (
                                        <tr
                                            key={patient.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-4">
                                                {index + 1}
                                            </td>

                                            <td className="px-4 py-4 font-medium text-[#361221]">
                                                {patient.user?.name ??
                                                    patient.name ??
                                                    "N/A"}
                                            </td>


                                            <td className="px-4 py-4">
                                                {patient.user?.email ?? patient.email ?? "N/A"}
                                            </td>

                                            <td className="px-4 py-4">
                                                {patient.phone ?? patient.user?.phone_number ?? "N/A"}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
