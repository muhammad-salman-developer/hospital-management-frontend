"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DepartmentForm } from "./department-form"
import { createDepartment } from "@/services/departmentService"

interface CreateDepartmentDialogProps {
    onCreated: () => void   // list refresh karne k liye
}

export function CreateDepartmentDialog({ onCreated }: CreateDepartmentDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='bg-[#42182b] p-5 hover:bg-[#42182b] cursor-pointer'
                render={
                    <Button >
                        <PlusIcon className="size-4" />
                        Add Department
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Department</DialogTitle>
                </DialogHeader>

                <DepartmentForm
                    onSubmit={async (data) => {
                        await createDepartment(data)
                    }}
                    onSuccess={() => {
                        setOpen(false)
                        onCreated()
                            toast.success("Department created successfully") 
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}