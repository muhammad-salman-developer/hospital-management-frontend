export interface Doctor {
  id: number
  user_id: number
  department_id: number
  qualification: string
  specialization: string
  consultation_fee: string
  status: "active" | "inactive" | "on_leave"
  image: string | null
  image_url?: string | null
  user: {
    id: number
    name: string
    email: string
  }
  department: {
    id: number
    name: string
  }
}