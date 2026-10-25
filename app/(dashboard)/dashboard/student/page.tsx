"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { submissionApi } from "@/lib/submission-api"
import type { Submission } from "@/types/submission"
import {
    CheckCircle2,
    Clock,
    FolderGit2,
    PlusCircle,
    XCircle,
    ArrowRight,
    ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmissionStatusBadge } from "@/components/dashboard/SubmissionStatusBadge"

export default function StudentDashboardPage() {
    const { user } = useAuth()
    const [submissions, setSubmissions] = React.useState<Submission[]>([])
    const [loading, setLoading] = React.useState(true)

    const [total, setTotal] = React.useState(0)
    const [pending, setPending] = React.useState(0)
    const [approved, setApproved] = React.useState(0)
    const [rejected, setRejected] = React.useState(0)

    React.useEffect(() => {
        submissionApi.getMy({ limit: 5 }).then((res) => {
            const list = res.data
            setSubmissions(list)
            setTotal(res.meta?.total ?? list.length)
            setPending(list.filter((s: Submission) => s.status === "PENDING").length)
            setApproved(list.filter((s: Submission) => s.status === "APPROVED").length)
            setRejected(list.filter((s: Submission) => s.status === "REJECTED").length)
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const stats = [
        { label: "Total Submitted", value: total, icon: FolderGit2, color: "text-primary", bg: "bg-primary/10" },
        { label: "Pending Review", value: pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Approved", value: approved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Rejected", value: rejected, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    ]

    return (
        <div className="max-w-4xl space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Welcome back, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Here's a snapshot of your project submissions.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className={`flex size-9 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`size-4.5 ${color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">
                                {loading ? <span className="animate-pulse">—</span> : value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Submissions */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Recent Submissions</h2>
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
                            <Link href="/dashboard/student/submissions">
                                View all <ArrowRight className="size-3.5" />
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="h-8 text-xs gap-1.5 cursor-pointer">
                            <Link href="/dashboard/student/submissions/new">
                                <PlusCircle className="size-3.5" /> New
                            </Link>
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 rounded-xl border border-border bg-card animate-pulse" />
                        ))}
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-12 text-center">
                        <FolderGit2 className="size-8 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-foreground">No submissions yet</p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">Submit your first project to get a mentor review.</p>
                        <Button asChild size="sm" className="gap-1.5 cursor-pointer">
                            <Link href="/dashboard/student/submissions/new">
                                <PlusCircle className="size-3.5" /> Submit a project
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                        {submissions.map((s) => (
                            <Link
                                key={s.id}
                                href={`/dashboard/student/submissions/${s.id}`}
                                className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors group"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                        {s.projectName}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {s.repoStack} · {s.projectType} · {new Date(s.createdAt).toLocaleDateString()}
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
