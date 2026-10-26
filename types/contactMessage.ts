export type MessageStatus = "pending" | "read" | "replied"

export interface ContactMessage {
    id: number
    name: string
    email: string
    phone: string | null
    subject: string
    message: string
    status: MessageStatus
    created_at: string
}