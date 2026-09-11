export type DayOfWeek =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"

export interface DoctorSchedule {
    id: number
    doctor_id: number
    day: DayOfWeek
    start_time: string
    end_time: string
    is_available: boolean
    doctor?: {
        id: number
        user?: {
            id: number
            name: string
        }
        department?: {
            id: number
            name: string
        }
    }
}

export interface DoctorScheduleFormValues {
    doctor_id: number
    day: DayOfWeek
    start_time: string
    end_time: string
    is_available: boolean
}