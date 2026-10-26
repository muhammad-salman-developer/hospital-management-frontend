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

import { PatientTable } from "@/components/admin/patient/patient-table";
import { PatientForm } from "@/components/admin/patient/patient-form";
import { usePatients } from "@/hooks/usePatients";
import { createOrUpdatePatientProfile } from "@/services/patientService";

export default function ReceptionPatientsPage() {
  const {
    patients,
    loading,
    error,
    fetchPatients,
    removePatient,
  } = usePatients();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#361221]">
            Patients
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage patient records and walk-in patients.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="cursor-pointer bg-[#42182b] p-5 hover:bg-[#361221]">
                <PlusIcon className="size-4" />
                Add Patient
              </Button>
            }
          />

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Patient (Walk-in)</DialogTitle>
            </DialogHeader>

            <PatientForm
              mode="create"
              onSubmit={async (data) => {
                await createOrUpdatePatientProfile(data);
              }}
              onSuccess={() => {
                setOpen(false);
                fetchPatients();
                toast.success("Patient added successfully");
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

      <Card className="border-none bg-[#361221] p-3 text-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <PatientTable
              patients={patients}
              onDelete={removePatient}
              onUpdated={fetchPatients}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}