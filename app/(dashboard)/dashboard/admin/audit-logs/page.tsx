"use client"

import * as React from "react"
import { auditLogApi } from "@/lib/audit-log-api"
import type { AuditLog, AuditAction, AuditLogQuery } from "@/types/auditLog"
import { Search, SlidersHorizontal, X, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// ── Action meta ───────────────────────────────────────────────────────────────
const ACTION_OPTS: { label: string; value: AuditAction | "" }[] = [
    { label: "All Actions", value: "" },
    { label: "Submission Created", value: "SUBMISSION_CREATED" },
    { label: "Submission Approved", value: "SUBMISSION_APPROVED" },
    { label: "Submission Rejected", value: "SUBMISSION_REJECTED" },
    { label: "Submission Deleted", value: "SUBMISSION_DELETED" },
    { label: "Role Updated", value: "USER_ROLE_UPDATED" },
    { label: "User Deleted", value: "USER_DELETED" },
    { label: "Password Changed", value: "USER_PASSWORD_CHANGED" },
    { label: "Password Reset", value: "USER_PASSWORD_RESET" },
]

const ACTION_COLOR: Record<AuditAction, string> = {
    SUBMISSION_CREATED: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    SUBMISSION_APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    SUBMISSION_REJECTED: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    SUBMISSION_DELETED: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    USER_ROLE_UPDATED: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    USER_DELETED: "bg-red-500/10 text-red-600 dark:text-red-400",
    USER_REGISTERED: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    USER_LOGIN: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    USER_PASSWORD_CHANGED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    USER_PASSWORD_RESET: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

const ACTION_LABEL: Record<AuditAction, string> = {
    SUBMISSION_CREATED: "Submission Created",
    SUBMISSION_APPROVED: "Submission Approved",
    SUBMISSION_REJECTED: "Submission Rejected",
    SUBMISSION_DELETED: "Submission Deleted",
    USER_ROLE_UPDATED: "Role Updated",
    USER_DELETED: "User Deleted",
    USER_REGISTERED: "User Registered",
    USER_LOGIN: "User Login",
    USER_PASSWORD_CHANGED: "Password Changed",
    USER_PASSWORD_RESET: "Password Reset",
}

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}

// Fields we render as highlighted pills
const HIGHLIGHT_KEYS = new Set(["studentName", "studentEmail", "targetName", "targetEmail"])

// Human-readable key labels
const KEY_LABEL: Record<string, string> = {
    studentName: "Student",
    studentEmail: "Email",
    targetName: "Target",
    targetEmail: "Email",
    projectName: "Project",
    projectType: "Type",
    reviewComments: "Comment",
    previousRole: "From",
    newRole: "To",
    targetRole: "Role",
    studentId: "Student ID",
}

function DetailsCell({ details }: { details: Record<string, unknown> | null }) {
    if (!details || Object.keys(details).length === 0)
        return <span className="text-muted-foreground">—</span>

    const highlighted = Object.entries(details).filter(([k]) => HIGHLIGHT_KEYS.has(k))
    const rest = Object.entries(details).filter(([k]) => !HIGHLIGHT_KEYS.has(k))

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
            {/* student / target identity — visually prominent */}
            {highlighted.map(([k, v]) => (
                <span key={k} className="flex items-center gap-1 text-[11px] font-medium text-foreground">
                    <span className="text-muted-foreground font-normal">{KEY_LABEL[k] ?? k}:</span>
                    {String(v ?? "—")}
                </span>
            ))}
            {/* secondary metadata — subdued */}
            {rest.map(([k, v]) => (
                v != null && String(v).trim() !== "" && (
                    <span key={k} className="text-[11px] text-muted-foreground">
                        <span className="font-medium">{KEY_LABEL[k] ?? k}:</span>{" "}{String(v)}
                    </span>
                )
            ))}
        </div>
    )
}

export default function AuditLogsPage() {
    const [logs, setLogs] = React.useState<AuditLog[]>([])
    const [meta, setMeta] = React.useState({ page: 1, limit: 20, total: 0, totalPages: 1 })
    const [loading, setLoading] = React.useState(true)
    const [page, setPage] = React.useState(1)
    const [action, setAction] = React.useState<AuditAction | "">("")
    const [searchInput, setSearchInput] = React.useState("")
    const [userIdFilter, setUserIdFilter] = React.useState("")

    const fetchLogs = React.useCallback(async () => {
        setLoading(true)
        try {
            const query: AuditLogQuery = { page, limit: 20 }
            if (action) query.action = action
            if (userIdFilter.trim()) query.userId = userIdFilter.trim()
            const res = await auditLogApi.getAll(query)
            setLogs(res.data)
            setMeta(res.meta ?? { page, limit: 20, total: res.data.length, totalPages: 1 })
        } catch {
            setLogs([])
        } finally {
            setLoading(false)
        }
    }, [page, action, userIdFilter])

    React.useEffect(() => { fetchLogs() }, [fetchLogs])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setUserIdFilter(searchInput)
        setPage(1)
    }

    const clearFilters = () => {
        setAction(""); setSearchInput(""); setUserIdFilter(""); setPage(1)
    }

    const hasFilters = action || userIdFilter

    return (
        <div className="mx-auto space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <ScrollText className="size-5 text-primary" />
                    Audit Logs
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {loading ? "Loading…" : `${meta.total} event${meta.total !== 1 ? "s" : ""} recorded`}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Filter by User ID…"
                            className="pl-8 h-8 text-xs"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="h-8 cursor-pointer">
                        <Search className="size-3.5" />
                    </Button>
                </form>

                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                    <select
                        value={action}
                        onChange={(e) => { setAction(e.target.value as AuditAction | ""); setPage(1) }}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    >
                        {ACTION_OPTS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    {hasFilters && (
                        <Button size="sm" variant="ghost" onClick={clearFilters} className="h-8 text-xs gap-1 text-muted-foreground cursor-pointer">
                            <X className="size-3.5" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-16 rounded-xl border border-border bg-card animate-pulse" />
                    ))}
                </div>
            ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-14 text-center">
                    <ScrollText className="size-8 text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-medium text-foreground">No audit logs found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-4 px-4 py-3.5 hover:bg-muted/40 transition-colors">

                            {/* Actor avatar */}
                            <Avatar className="size-8 shrink-0 mt-0.5">
                                <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
                                    {getInitials(log.user.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Main content */}
                            <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-foreground">{log.user.name}</span>
                                    <span className="text-xs text-muted-foreground">{log.user.email}</span>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${log.user.role === "ADMIN" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        : log.user.role === "MENTOR" ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                            : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                        }`}>
                                        {log.user.role}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ACTION_COLOR[log.action]}`}>
                                        {ACTION_LABEL[log.action]}
                                    </span>
                                    {log.targetId && (
                                        <span className="text-[11px] text-muted-foreground font-mono">
                                            #{log.targetId.slice(0, 8)}…
                                        </span>
                                    )}
                                </div>

                                <DetailsCell details={log.details} />
                            </div>

                            {/* Timestamp */}
                            <p className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap mt-0.5">
                                {formatDate(log.createdAt)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground">
                        Page {meta.page} of {meta.totalPages} · {meta.total} total
                    </p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => p - 1)} disabled={page <= 1 || loading} className="h-8 text-xs cursor-pointer">
                            Previous
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page >= meta.totalPages || loading} className="h-8 text-xs cursor-pointer">
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
