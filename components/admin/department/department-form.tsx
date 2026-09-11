"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface DepartmentFormProps {
    initialData?: { name: string; description: string }
    onSubmit: (data: { name: string; description: string }) => Promise<void>
    onSuccess: () => void
    mode?: "create" | "edit"
}

const DEFAULT_FORM = { name: "", description: "" }   // 👈 Component se BAHAR — sirf ek dafa banega

export function DepartmentForm({
    initialData = DEFAULT_FORM,                        // 👈 ab hamesha same reference
    onSubmit,
    onSuccess,
    mode = "create",
}: DepartmentFormProps) {
    const [form, setForm] = useState(initialData)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setForm(initialData)
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            await onSubmit(form)
            onSuccess()
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            }
        } finally {
            setLoading(false)
        }
    }

    const buttonText = loading
        ? mode === "edit" ? "Updating..." : "Adding..."
        : mode === "edit" ? "Update" : "Add"

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                    className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    className="focus-visible:border-[#42182b] focus-visible:ring-[#42182b]/50 focus-visible:ring-[3px]"
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description[0]}</p>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5"
                >
                    {buttonText}
                </Button>
            </div>
        </form>
    )
}