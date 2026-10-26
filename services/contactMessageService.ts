import api from "@/lib/axios"
import { MessageStatus } from "@/types/contactMessage"

export async function getContactMessages() {
    const res = await api.get("/contact-messages")
    return res.data.data
}

export async function updateMessageStatus(id: number, status: MessageStatus) {
    const res = await api.put(`/contact-messages/${id}/status`, { status })
    return res.data.data
}

export async function deleteContactMessage(id: number) {
    const res = await api.delete(`/contact-messages/${id}`)
    return res.data
}