"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { submissionApi } from "@/lib/submission-api"
import type { Submission, SubmissionStats } from "@/types/submission"
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    ExternalLink,
    TrendingUp,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmissionStatusBadge } from "@/components/dashboard/SubmissionStatusBadge"

export default function MentorDashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = React.useState<SubmissionStats | null>(null)
    const [recent, setRecent] = React.useState<Submission[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        Promise.all([
            submissionApi.getStats(),
            submissionApi.getAll({ limit: 5, status: "PENDING" }),
        ]).then(([statsRes, listRes]) => {
            setStats(statsRes.data)
            setRecent(listRes.data)
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const statCards = [
        { label: "Total Submissions", value: stats?.total ?? 0, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
        { label: "Pending Review", value: stats?.pending ?? 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Approved", value: stats?.approved ?? 0, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Rejected", value: stats?.rejected ?? 0, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    ]

    return (
        <div className="max-w-4xl space-y-8">

            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Welcome back, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {stats ? `Approval rate: ${stats.approvalRate}% · ${stats.pending} pending review` : "Loading your stats…"}
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className={`flex size-9 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`size-4.5 ${color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">
                                {loading ? <span className="animate-pulse text-muted-foreground">—</span> : value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending Queue Preview */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Pending Reviews</h2>
                    <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
                        <Link href="/dashboard/mentor/submissions">
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
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-10 text-center">
                        <CheckCircle2 className="size-7 text-emerald-500 mb-2" />
                        <p className="text-sm font-medium text-foreground">All caught up!</p>
                        <p className="text-xs text-muted-foreground mt-1">No submissions are pending review right now.</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                        {recent.map((s) => (
                            <Link
                                key={s.id}
                                href={`/dashboard/mentor/submissions/${s.id}`}
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

            {/* By Project Type */}
            {stats && stats.byProjectType.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submissions by Type</p>
                    <div className="flex gap-4 flex-wrap">
                        {stats.byProjectType.map(({ type, count }) => (
                            <div key={type} className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary/60" />
                                <span className="text-sm font-medium text-foreground">{count}</span>
                                <span className="text-xs text-muted-foreground">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
