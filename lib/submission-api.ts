import { apiRequest } from "./api"
import type {
    CreateSubmissionPayload,
    Submission,
    SubmissionQuery,
} from "@/types/submission"

function buildQuery(params: SubmissionQuery): string {
    const q = new URLSearchParams()
    if (params.page) q.set("page", String(params.page))
    if (params.limit) q.set("limit", String(params.limit))
    if (params.status) q.set("status", params.status)
    if (params.projectType) q.set("projectType", params.projectType)
    if (params.search) q.set("search", params.search)
    const str = q.toString()
    return str ? `?${str}` : ""
}

export const submissionApi = {
    // Student
    create: (payload: CreateSubmissionPayload) =>
        apiRequest<Submission>("/submissions", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    getMy: (query: SubmissionQuery = {}) =>
        apiRequest<Submission[]>(`/submissions/my${buildQuery(query)}`),

    getMyById: (id: string) =>
        apiRequest<Submission>(`/submissions/my/${id}`),

    deleteMy: (id: string) =>
        apiRequest<null>(`/submissions/my/${id}`, { method: "DELETE" }),
}
