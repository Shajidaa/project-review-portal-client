import type { UserRole } from "./auth"

export type Gender = "MALE" | "FEMALE"

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    gender?: Gender | null
    avatarUrl?: string | null
    emailVerified: boolean
    authProvider: string
    createdAt: string
    updatedAt: string
}

export interface UserQuery {
    page?: number
    limit?: number
    role?: UserRole
    search?: string
}

export interface UpdateRolePayload {
    role: UserRole
}

export interface UpdateProfilePayload {
    name?: string
    gender?: Gender
    avatarUrl?: string
}
