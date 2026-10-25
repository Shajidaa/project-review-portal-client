export type UserRole = "STUDENT" | "MENTOR" | "ADMIN"
export type ActiveRole = UserRole | "GUEST"

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string | null
  emailVerified: boolean
  gender?: "MALE" | "FEMALE" | null
}
