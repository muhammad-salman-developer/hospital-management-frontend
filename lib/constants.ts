import { DayOfWeek } from "@/types/doctorSchedule"

export const DAY_SHORT: Record<DayOfWeek, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
}
export const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? ""