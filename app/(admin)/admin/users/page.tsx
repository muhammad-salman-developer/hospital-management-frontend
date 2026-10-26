"use client"

import { useEffect, useState } from "react"
import { PlusIcon, MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { getUsers, createUser, updateUser, deleteUser } from "@/services/userService"
import { StaffUser, StaffRole } from "@/types/user"

const ROLE_LABELS: Record<StaffRole, string> = {
    doctor: "Doctor",
    receptionist: "Receptionist",
}

interface FormState {
    name: string
    email: string
    password: string
    role: StaffRole | ""
}

const EMPTY_FORM: FormState = { name: "", email: "", password: "", role: "" }

export default function UsersPage() {
    const [users, setUsers] = useState<StaffUser[]>([])
    const [loading, setLoading] = useState(true)

    const [formOpen, setFormOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<StaffUser | null>(null)
    const [form, setForm] = useState<FormState>(EMPTY_FORM)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [saving, setSaving] = useState(false)

    const [deletingUser, setDeletingUser] = useState<StaffUser | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            setUsers((await getUsers()) ?? [])
        } catch (error) {
            console.error(error)
            toast.error("Failed to load users.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const openCreate = () => {
        setEditingUser(null)
        setForm(EMPTY_FORM)
        setErrors({})
        setFormOpen(true)
    }

    const openEdit = (user: StaffUser) => {
        setEditingUser(user)
        setForm({
            name: user.name,
            email: user.email,
            password: "",
            role: (user.roles[0]?.name as StaffRole) ?? "",
        })
        setErrors({})
        setFormOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: Record<string, string[]> = {}
        if (!form.name.trim()) newErrors.name = ["Name is required."]
        if (!form.email.trim()) newErrors.email = ["Email is required."]
        if (!editingUser && form.password.length < 8)
            newErrors.password = ["Password must be at least 8 characters."]
        if (!form.role) newErrors.role = ["Role is required."]

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setSaving(true)
        try {
            const payload = {
                name: form.name,
                email: form.email,
                role: form.role as StaffRole,
                ...(form.password ? { password: form.password } : {}),
            }

            if (editingUser) {
                await updateUser(editingUser.id, payload)
                toast.success("User updated successfully")
            } else {
                await createUser(payload)
                toast.success("User created successfully")
            }

            setFormOpen(false)
            fetchUsers()
        } catch (err: any) {
            if (err.response?.status === 422 && err.response.data?.errors) {
                setErrors(err.response.data.errors)
            } else {
                toast.error(err?.response?.data?.message ?? "Something went wrong.")
            }
        } finally {
            setSaving(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!deletingUser) return
        setDeleteLoading(true)
        try {
            await deleteUser(deletingUser.id)
            setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id))
            setDeletingUser(null)
            toast.success("User deleted successfully")
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to delete user")
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create staff accounts. They log in with the email and password you set.
                    </p>
                </div>

                <Button
                    onClick={openCreate}
                    className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5"
                >
                    <PlusIcon className="size-4" />
                    Add User
                </Button>
            </div>

            <Card className="bg-[#361221] text-white border-none p-3">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-6 space-y-3">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                            No staff users yet.
                        </div>
                    ) : (
                        <Table className="border border-[#42182b]/20">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold text-white">Name</TableHead>
                                    <TableHead className="font-semibold text-white">Email</TableHead>
                                    <TableHead className="font-semibold text-white">Role</TableHead>
                                    <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="capitalize">
                                                {ROLE_LABELS[user.roles[0]?.name as StaffRole] ??
                                                    user.roles[0]?.name ??
                                                    "—"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
                                                            <MoreHorizontalIcon className="size-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    }
                                                />
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="cursor-pointer" onClick={() => openEdit(user)}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        variant="destructive"
                                                        onClick={() => setDeletingUser(user)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create / Edit dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password {editingUser && "(leave blank to keep current)"}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={form.role}
                                onValueChange={(value) => setForm({ ...form, role: value as StaffRole })}
                            >
                                <SelectTrigger id="role" className="w-full">
                                    <SelectValue placeholder="Select a role">
                                        {form.role ? ROLE_LABELS[form.role] : undefined}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {(Object.keys(ROLE_LABELS) as StaffRole[]).map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {ROLE_LABELS[role]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-sm text-red-500">{errors.role[0]}</p>}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-[#42182b] hover:bg-[#42182b] cursor-pointer p-5"
                            >
                                {saving ? "Saving..." : editingUser ? "Update User" : "Create User"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete dialog */}
            <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{deletingUser?.name}</span>{" "}
                        will lose access and the account will be permanently deleted.
                    </p>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setDeletingUser(null)} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteLoading}>
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}