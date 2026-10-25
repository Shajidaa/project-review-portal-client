import { apiRequest } from "./api"
import type { AuditLog, AuditLogQuery } from "@/types/auditLog"

function buildQuery(params: AuditLogQuery): string {
    const q = new URLSearchParams()
    if (params.page) q.set("page", String(params.page))
    if (params.limit) q.set("limit", String(params.limit))
    if (params.userId) q.set("userId", params.userId)
    if (params.action) q.set("action", params.action)
    if (params.targetId) q.set("targetId", params.targetId)
    if (params.from) q.set("from", params.from)
    if (params.to) q.set("to", params.to)
    const s = q.toString()
    return s ? `?${s}` : ""
}

export const auditLogApi = {
    getAll: (query: AuditLogQuery = {}) =>
        apiRequest<AuditLog[]>(`/audit-logs${buildQuery(query)}`),

    getByUser: (userId: string, query: AuditLogQuery = {}) =>
        apiRequest<AuditLog[]>(`/audit-logs/users/${userId}${buildQuery(query)}`),
}
