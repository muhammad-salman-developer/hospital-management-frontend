import api from "@/lib/axios"
import { StaffRole } from "@/types/user"

export interface UserPayload {
    name: string
    email: string
    password?: string
    role: StaffRole
}

export async function getUsers() {
    const res = await api.get("/users")
    return res.data.data
}

export async function createUser(payload: UserPayload) {
    const res = await api.post("/users", payload)
    return res.data.data
}

export async function updateUser(id: number, payload: UserPayload) {
    const res = await api.put(`/users/${id}`, payload)
    return res.data.data
}

export async function deleteUser(id: number) {
    const res = await api.delete(`/users/${id}`)
    return res.data
}