"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { submissionApi } from "@/lib/submission-api"
import type { Submission, SubmissionStats } from "@/types/submission"
import {
    ArrowRight,
    BarChart2,
    CheckCircle2,
    Clock,
    ExternalLink,
    FolderGit2,
    TrendingUp,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmissionStatusBadge } from "@/components/dashboard/SubmissionStatusBadge"

export default function AdminDashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = React.useState<SubmissionStats | null>(null)
    const [recent, setRecent] = React.useState<Submission[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        Promise.all([
            submissionApi.getStats(),
            submissionApi.getAll({ limit: 5 }),
        ]).then(([statsRes, listRes]) => {
            setStats(statsRes.data)
            setRecent(listRes.data)
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const statCards = [
        { label: "Total Submissions", value: stats?.total, icon: FolderGit2, color: "text-primary", bg: "bg-primary/10" },
        { label: "Pending", value: stats?.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Approved", value: stats?.approved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Rejected", value: stats?.rejected, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
        { label: "Approval Rate", value: stats ? `${stats.approvalRate}%` : undefined, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10" },
        { label: "Project Types", value: stats?.byProjectType.length, icon: BarChart2, color: "text-sky-500", bg: "bg-sky-500/10" },
    ]

    return (
        <div className="max-w-5xl space-y-8">

            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Welcome back, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Platform overview at a glance.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className={`flex size-8 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`size-4 ${color}`} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-foreground">
                                {loading ? <span className="animate-pulse text-muted-foreground">—</span> : (value ?? 0)}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* By Project Type */}
            {stats && stats.byProjectType.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submissions by Project Type</p>
                    <div className="grid grid-cols-3 gap-4">
                        {stats.byProjectType.map(({ type, count }) => {
                            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                            return (
                                <div key={type} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-foreground">{type}</span>
                                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Recent Submissions */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Recent Submissions</h2>
                    <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
                        <Link href="/dashboard/admin/submissions">
                            View all <ArrowRight className="size-3.5" />
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 rounded-xl border border-border bg-card animate-pulse" />
                        ))}
                    </div>
                ) : recent.length === 0 ? (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-card py-10">
                        <p className="text-sm text-muted-foreground">No submissions yet.</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                        {recent.map((s) => (
                            <Link
                                key={s.id}
                                href={`/dashboard/admin/submissions/${s.id}`}
                                className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors group"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                        {s.projectName}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {s.student.name} · {s.repoStack} · {new Date(s.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <SubmissionStatusBadge status={s.status} />
                                    <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
