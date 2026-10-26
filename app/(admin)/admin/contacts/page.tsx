"use client"

import { useEffect, useState } from "react"
import { Mail, Trash2, Eye, MailCheck, User, Phone } from "lucide-react"
import { toast } from "sonner"
import {
    getContactMessages,
    updateMessageStatus,
    deleteContactMessage,
} from "@/services/contactMessageService"
import { ContactMessage } from "@/types/contactMessage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    pending: "secondary",
    read: "default",
    replied: "default",
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null)
    const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const data = await getContactMessages()
            setMessages(data?.data ?? data ?? [])
        } catch (error) {
            console.error("Failed to fetch messages:", error)
            toast.error("Failed to load messages.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleView = async (message: ContactMessage) => {
        setViewingMessage(message)

        if (message.status === "pending") {
            try {
                await updateMessageStatus(message.id, "read")
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === message.id ? { ...m, status: "read" } : m
                    )
                )
            } catch (error) {
                console.error("Failed to update status:", error)
            }
        }
    }

    const handleMarkReplied = async () => {
        if (!viewingMessage) return

        try {
            await updateMessageStatus(viewingMessage.id, "replied")
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === viewingMessage.id ? { ...m, status: "replied" } : m
                )
            )
            toast.success("Marked as replied")
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handleConfirmDelete = async () => {
        if (!deletingMessage) return

        setDeleteLoading(true)
        try {
            await deleteContactMessage(deletingMessage.id)
            setMessages((prev) => prev.filter((m) => m.id !== deletingMessage.id))
            setDeletingMessage(null)
            toast.success("Message deleted successfully")
        } catch (error) {
            toast.error("Failed to delete message")
        } finally {
            setDeleteLoading(false)
        }
    }

    const pendingCount = messages.filter((m) => m.status === "pending").length
    const repliedCount = messages.filter((m) => m.status === "replied").length

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Contact form submissions from your website.
                </p>
            </div>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))
                ) : (
                    <>
                        <Card className="bg-[#361221] text-white border-none">
                            <CardContent className="p-5">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-[#42182b]">
                                    <Mail className="size-5 text-[#36B9A6]" />
                                </div>
                                <p className="mt-4 text-2xl font-bold">{messages.length}</p>
                                <p className="mt-1 text-xs text-white/50">Total Messages</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#361221] text-white border-none">
                            <CardContent className="p-5">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-[#42182b]">
                                    <Mail className="size-5 text-yellow-400" />
                                </div>
                                <p className="mt-4 text-2xl font-bold">{pendingCount}</p>
                                <p className="mt-1 text-xs text-white/50">Pending</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#361221] text-white border-none">
                            <CardContent className="p-5">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-[#42182b]">
                                    <MailCheck className="size-5 text-[#36B9A6]" />
                                </div>
                                <p className="mt-4 text-2xl font-bold">{repliedCount}</p>
                                <p className="mt-1 text-xs text-white/50">Replied</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* ================= MESSAGES TABLE ================= */}
            <Card className="bg-[#361221] text-white border-none p-3">
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#42182b]">

                        <div className="hidden grid-cols-[1fr_1fr_1.5fr_100px_120px] gap-4 border-b border-white/10 bg-[#361221]/40 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white/50 lg:grid">
                            <span>Name</span>
                            <span>Contact</span>
                            <span>Subject</span>
                            <span>Status</span>
                            <span className="text-right">Actions</span>
                        </div>

                        {loading ? (
                            <div className="space-y-4 p-6">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <Mail className="mx-auto size-10 text-white/20" />
                                <p className="mt-4 text-sm font-medium text-white">
                                    No messages yet
                                </p>
                                <p className="mt-1 text-xs text-white/40">
                                    Contact form submissions will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="grid gap-4 px-6 py-5 transition-colors hover:bg-[#361221]/30 lg:grid-cols-[1fr_1fr_1.5fr_100px_120px] lg:items-center"
                                    >
                                        {/* NAME */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#361221]">
                                                <User className="size-4 text-[#36B9A6]" />
                                            </div>
                                            <p className="text-sm font-medium text-white">
                                                {message.name}
                                            </p>
                                        </div>

                                        {/* CONTACT (email + phone) */}
                                        <div>
                                            <p className="text-sm text-white/80">{message.email}</p>
                                            {message.phone && (
                                                <p className="flex items-center gap-1 text-xs text-white/40">
                                                    <Phone className="size-3" />
                                                    {message.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* SUBJECT + PREVIEW */}
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {message.subject}
                                            </p>
                                            <p className="line-clamp-1 text-xs text-white/50">
                                                {message.message}
                                            </p>
                                        </div>

                                        {/* STATUS */}
                                        <div>
                                            <Badge
                                                variant={statusVariant[message.status] ?? "secondary"}
                                                className="capitalize"
                                            >
                                                {message.status}
                                            </Badge>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex justify-start gap-2 lg:justify-end">
                                            <button
                                                type="button"
                                                onClick={() => handleView(message)}
                                                className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10"
                                                title="View message"
                                            >
                                                <Eye className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingMessage(message)}
                                                className="flex size-9 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-300 transition-colors hover:bg-red-400/20"
                                                title="Delete message"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ================= VIEW MESSAGE DIALOG ================= */}
            <Dialog
                open={!!viewingMessage}
                onOpenChange={(open) => !open && setViewingMessage(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{viewingMessage?.subject}</DialogTitle>
                    </DialogHeader>

                    {viewingMessage && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Name</p>
                                    <p className="font-medium">{viewingMessage.name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Email</p>
                                    <p className="font-medium">{viewingMessage.email}</p>
                                </div>
                                {viewingMessage.phone && (
                                    <div>
                                        <p className="text-muted-foreground">Phone</p>
                                        <p className="font-medium">{viewingMessage.phone}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-muted-foreground">Received</p>
                                    <p className="font-medium">
                                        {new Date(viewingMessage.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 text-sm text-muted-foreground">Message</p>
                                <p className="whitespace-pre-line rounded-lg bg-muted p-4 text-sm">
                                    {viewingMessage.message}
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <a href={`mailto:${viewingMessage.email}`}>
                                    <Button variant="outline" onClick={handleMarkReplied}>
                                        Reply via Email
                                    </Button>
                                </a>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ================= DELETE CONFIRMATION DIALOG ================= */}
            <Dialog
                open={!!deletingMessage}
                onOpenChange={(open) => !open && setDeletingMessage(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Message from{" "}
                        <span className="font-medium text-foreground">
                            {deletingMessage?.name}
                        </span>{" "}
                        will be permanently deleted.
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeletingMessage(null)}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}