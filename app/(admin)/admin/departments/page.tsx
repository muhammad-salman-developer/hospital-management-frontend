"use client";

import { useEffect } from "react";
import { DepartmentTable } from "@/components/admin/department/DepartmentTable";
import { CreateDepartmentDialog } from "@/components/admin/department/CreateDepartmentDialog";
import { useDepartments } from "@/hooks/useDepartments";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentsPage() {
  const {
    departments,
    loading,
    error,
    fetchDepartments,
    removeDepartment,
  } = useDepartments();

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Departments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage hospital departments and their details.
          </p>
        </div>

        <CreateDepartmentDialog onCreated={fetchDepartments} />
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
            </div>
          ) : (
            <DepartmentTable
              departments={departments}
              onDelete={removeDepartment}
              onUpdated={fetchDepartments}   
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}