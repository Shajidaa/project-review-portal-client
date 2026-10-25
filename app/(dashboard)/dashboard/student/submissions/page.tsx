"use client"

import * as React from "react"
import Link from "next/link"
import { submissionApi } from "@/lib/submission-api"
import type { Submission, SubmissionMeta, SubmissionStatus } from "@/types/submission"
import { ExternalLink, FolderGit2, PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmissionStatusBadge } from "@/components/dashboard/SubmissionStatusBadge"

const STATUS_TABS: { label: string; value: SubmissionStatus | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
]

export default function MySubmissionsPage() {
    const [submissions, setSubmissions] = React.useState<Submission[]>([])
    const [meta, setMeta] = React.useState<SubmissionMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 })
    const [loading, setLoading] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState<SubmissionStatus | "ALL">("ALL")
    const [page, setPage] = React.useState(1)
    const [deletingId, setDeletingId] = React.useState<string | null>(null)

    const fetchSubmissions = React.useCallback(async () => {
        setLoading(true)
        try {
            const res = await submissionApi.getMy({
                page,
                limit: 10,
                status: activeTab === "ALL" ? undefined : activeTab,
            })
            setSubmissions(res.data)
            setMeta(res.meta ?? { page, limit: 10, total: res.data.length, totalPages: 1 })
        } catch {
            setSubmissions([])
        } finally {
            setLoading(false)
        }
    }, [page, activeTab])

    React.useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

    const handleTabChange = (tab: SubmissionStatus | "ALL") => {
        setActiveTab(tab)
        setPage(1)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this submission? This cannot be undone.")) return
        setDeletingId(id)
        try {
            await submissionApi.deleteMy(id)
            // optimistically remove, then re-fetch to sync meta counts
            setSubmissions((prev) => prev.filter((s) => s.id !== id))
            setMeta((prev) => ({ ...prev, total: prev.total - 1 }))
        } catch (e: unknown) {
            alert((e as Error).message ?? "Failed to delete")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="max-w-4xl space-y-6">

            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-foreground">My Submissions</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {loading ? "Loading…" : `${meta.total} project${meta.total !== 1 ? "s" : ""} submitted`}
                    </p>
                </div>
                <Button asChild size="sm" className="gap-1.5 shrink-0 cursor-pointer">
                    <Link href="/dashboard/student/submissions/new">
                        <PlusCircle className="size-4" /> New Submission
                    </Link>
                </Button>
            </div>

            {/* ── Status Tabs ── */}
            <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${activeTab === tab.value
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── List ── */}
            {loading ? (
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 rounded-xl border border-border bg-card animate-pulse" />
                    ))}
                </div>
            ) : submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
                    <FolderGit2 className="size-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground">No submissions found</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                        {activeTab === "ALL"
                            ? "You haven't submitted any projects yet."
                            : `No ${activeTab.toLowerCase()} submissions.`}
                    </p>
                    {activeTab === "ALL" && (
                        <Button asChild size="sm" className="gap-1.5 cursor-pointer">
                            <Link href="/dashboard/student/submissions/new">
                                <PlusCircle className="size-3.5" /> Submit a project
                            </Link>
                        </Button>
                    )}
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                    {submissions.map((s) => (
                        <div
                            key={s.id}
                            className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition-colors group"
                        >
                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                        href={`/dashboard/student/submissions/${s.id}`}
                                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate"
                                    >
                                        {s.projectName}
                                    </Link>
                                    <SubmissionStatusBadge status={s.status} />
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                                    <span>{s.repoStack}</span>
                                    <span>·</span>
                                    <span>{s.projectType}</span>
                                    <span>·</span>
                                    <span>{new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                </div>
                                {s.reviewComments && (
                                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1 italic">
                                        "{s.reviewComments}"
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                                <Button
                                    asChild
                                    size="icon"
                                    variant="ghost"
                                    className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                                    title="Open repository"
                                >
                                    <a href={s.repoUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                </Button>

                                {s.status === "PENDING" && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete(s.id)}
                                        disabled={deletingId === s.id}
                                        title="Delete submission"
                                        className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground">
                        Page {meta.page} of {meta.totalPages} · {meta.total} total
                    </p>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page <= 1 || loading}
                            className="h-8 text-xs cursor-pointer"
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= meta.totalPages || loading}
                            className="h-8 text-xs cursor-pointer"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
