export type ProjectType = "WEB" | "MOBILE" | "OTHER"
export type RepoStack = "Frontend" | "Backend" | "Fullstack" | "Mobile" | "Other"
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface SubmissionUser {
    id: string
    name: string
    email: string
    avatarUrl?: string | null
}

export interface Submission {
    id: string
    projectName: string
    projectType: ProjectType
    repoUrl: string
    liveLink: string
    description: string
    repoStack: RepoStack
    projectImage?: string | null
    status: SubmissionStatus
    reviewStatus: SubmissionStatus
    reviewComments?: string | null
    reviewedAt?: string | null
    createdAt: string
    updatedAt: string
    student: SubmissionUser
    reviewedBy?: SubmissionUser | null
}

export interface SubmissionMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface SubmissionListResponse {
    submissions: Submission[]
    meta: SubmissionMeta
}

export interface CreateSubmissionPayload {
    projectName: string
    projectType: ProjectType
    repoUrl: string
    liveLink: string
    description: string
    repoStack: RepoStack
    projectImage?: string
}

export interface ReviewSubmissionPayload {
    reviewStatus: "APPROVED" | "REJECTED"
    reviewComments?: string
}

export interface SubmissionStats {
    total: number
    pending: number
    approved: number
    rejected: number
    approvalRate: number
    byProjectType: { type: ProjectType; count: number }[]
}

export interface SubmissionQuery {
    page?: number
    limit?: number
    status?: SubmissionStatus
    projectType?: ProjectType
    search?: string
}
