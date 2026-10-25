export type AuditAction =
    | "SUBMISSION_CREATED"
    | "SUBMISSION_APPROVED"
    | "SUBMISSION_REJECTED"
    | "SUBMISSION_DELETED"
    | "USER_ROLE_UPDATED"
    | "USER_DELETED"
    | "USER_REGISTERED"
    | "USER_LOGIN"
    | "USER_PASSWORD_CHANGED"
    | "USER_PASSWORD_RESET"

export interface AuditLogActor {
    id: string
    name: string
    email: string
    role: "STUDENT" | "MENTOR" | "ADMIN"
}

export interface AuditLog {
    id: string
    action: AuditAction
    targetId: string | null
    details: Record<string, unknown> | null
    createdAt: string
    user: AuditLogActor
}

export interface AuditLogQuery {
    page?: number
    limit?: number
    userId?: string
    action?: AuditAction
    targetId?: string
    from?: string
    to?: string
}
