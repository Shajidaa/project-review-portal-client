"use client"

import * as React from "react"
import Link from "next/link"
import { submissionApi } from "@/lib/submission-api"
import type { Submission, SubmissionMeta, SubmissionStatus, ProjectType } from "@/types/submission"
import { ExternalLink, Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SubmissionStatusBadge } from "./SubmissionStatusBadge"

interface SubmissionsTableProps {
    /** base href for the detail page link, e.g. "/dashboard/mentor/submissions" */
    detailBase: string
}

const STATUS_OPTS: { label: string; value: SubmissionStatus | "" }[] = [
    { label: "All Status", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
]

const TYPE_OPTS: { label: string; value: ProjectType | "" }[] = [
    { label: "All Types", value: "" },
    { label: "Web", value: "WEB" },
    { label: "Mobile", value: "MOBILE" },
    { label: "Other", value: "OTHER" },
]

export function SubmissionsTable({ detailBase }: SubmissionsTableProps) {
    const [submissions, setSubmissions] = React.useState<Submission[]>([])
    const [meta, setMeta] = React.useState<SubmissionMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 })
    const [loading, setLoading] = React.useState(true)
    const [page, setPage] = React.useState(1)
    const [search, setSearch] = React.useState("")
    const [searchInput, setSearchInput] = React.useState("")
    const [status, setStatus] = React.useState<SubmissionStatus | "">("")
    const [type, setType] = React.useState<ProjectType | "">("")

    const fetch = React.useCallback(async () => {
        setLoading(true)
        try {
            const res = await submissionApi.getAll({
                page,
                limit: 10,
                search: search || undefined,
                status: status || undefined,
                projectType: type || undefined,
            })
            setSubmissions(res.data)
            setMeta(res.meta ?? { page, limit: 10, total: res.data.length, totalPages: 1 })
        } catch {
            setSubmissions([])
        } finally {
            setLoading(false)
        }
    }, [page, search, status, type])

    React.useEffect(() => { fetch() }, [fetch])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setSearch(searchInput)
        setPage(1)
    }

    const clearFilters = () => {
        setSearch(""); setSearchInput(""); setStatus(""); setType(""); setPage(1)
    }

    const hasFilters = search || status || type

    return (
        <div className="space-y-4">
            {/* Filters bar */}
            <div className="flex flex-wrap items-center gap-2">
                <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search project or student…"
                            className="pl-8 h-8 text-xs"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="h-8 text-xs cursor-pointer">
                        <Search className="size-3.5" />
                    </Button>
                </form>

                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value as SubmissionStatus | ""); setPage(1) }}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    >
                        {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select
                        value={type}
                        onChange={(e) => { setType(e.target.value as ProjectType | ""); setPage(1) }}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    >
                        {TYPE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {hasFilters && (
                        <Button size="sm" variant="ghost" onClick={clearFilters} className="h-8 text-xs gap-1 text-muted-foreground cursor-pointer">
                            <X className="size-3.5" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Count */}
            <p className="text-xs text-muted-foreground">
                {loading ? "Loading…" : `${meta.total} submission${meta.total !== 1 ? "s" : ""}`}
            </p>

            {/* Table */}
            {loading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 rounded-xl border border-border bg-card animate-pulse" />
                    ))}
                </div>
            ) : submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-14 text-center">
                    <p className="text-sm font-medium text-foreground">No submissions found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                    {submissions.map((s) => (
                        <div key={s.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/40 transition-colors group">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                        href={`${detailBase}/${s.id}`}
                                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate"
                                    >
                                        {s.projectName}
                                    </Link>
                                    <SubmissionStatusBadge status={s.status} />
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
                                    <span className="font-medium text-foreground/70">{s.student.name}</span>
                                    <span>·</span>
                                    <span>{s.repoStack}</span>
                                    <span>·</span>
                                    <span>{s.projectType}</span>
                                    <span>·</span>
                                    <span>{new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                                <Button asChild size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-foreground cursor-pointer" title="Open repo">
                                    <a href={s.repoUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                </Button>
                                <Button asChild size="sm" variant="outline" className="h-7 text-xs cursor-pointer">
                                    <Link href={`${detailBase}/${s.id}`}>Review</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground">Page {meta.page} of {meta.totalPages}</p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => p - 1)} disabled={page <= 1 || loading} className="h-8 text-xs cursor-pointer">Previous</Button>
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page >= meta.totalPages || loading} className="h-8 text-xs cursor-pointer">Next</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
