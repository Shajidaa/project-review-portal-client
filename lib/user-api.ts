import { apiRequest } from "./api"
import type { User, UserQuery, UpdateRolePayload } from "@/types/user"

function buildQuery(params: UserQuery): string {
    const q = new URLSearchParams()
    if (params.page) q.set("page", String(params.page))
    if (params.limit) q.set("limit", String(params.limit))
    if (params.role) q.set("role", params.role)
    if (params.search) q.set("search", params.search)
    const s = q.toString()
    return s ? `?${s}` : ""
}

export const userApi = {
    getAll: (query: UserQuery = {}) =>
        apiRequest<User[]>(`/users${buildQuery(query)}`),

    getById: (id: string) =>
        apiRequest<User>(`/users/${id}`),

    updateRole: (id: string, payload: UpdateRolePayload) =>
        apiRequest<User>(`/users/${id}/role`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    delete: (id: string) =>
        apiRequest<null>(`/users/${id}`, { method: "DELETE" }),
}
