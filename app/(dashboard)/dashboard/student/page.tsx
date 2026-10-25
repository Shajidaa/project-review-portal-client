"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { submissionApi } from "@/lib/submission-api"
import type { Submission } from "@/types/submission"
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    ExternalLink,
    FolderGit2,
    PlusCircle,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmissionStatusBadge } from "@/components/dashboard/SubmissionStatusBadge"
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
} from "recharts"

const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: "#f59e0b",
    APPROVED: "#10b981",
    REJECTED: "#f43f5e",
}

const STACK_COLORS = [
    "hsl(var(--primary))",
    "#0ea5e9",
    "#8b5cf6",
    "#f59e0b",
    "#10b981",
]

export default function StudentDashboardPage() {
    const { user } = useAuth()

    // full list for charts  (up to 100 — enough for any real student)
    const [allSubmissions, setAllSubmissions] = React.useState<Submission[]>([])
    // first 5 for the recent list
    const [recent, setRecent] = React.useState<Submission[]>([])
    const [total, setTotal] = React.useState(0)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        Promise.all([
            submissionApi.getMy({ limit: 100 }),   // for charts + counts
            submissionApi.getMy({ limit: 5 }),      // for recent list
        ]).then(([allRes, recentRes]) => {
            const all = allRes.data
            setAllSubmissions(all)
            setTotal(allRes.meta?.total ?? all.length)
            setRecent(recentRes.data)
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    /* ── Derived counts ────────────────────────────────────────────── */
    const pending = allSubmissions.filter((s) => s.status === "PENDING").length
    const approved = allSubmissions.filter((s) => s.status === "APPROVED").length
    const rejected = allSubmissions.filter((s) => s.status === "REJECTED").length
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

    /* ── Chart data ────────────────────────────────────────────────── */
    const statusPieData = [
        { name: "Pending", value: pending },
        { name: "Approved", value: approved },
        { name: "Rejected", value: rejected },
    ].filter((d) => d.value > 0)

    // group by repoStack
    const stackMap: Record<string, { total: number; approved: number }> = {}
    allSubmissions.forEach((s) => {
        if (!stackMap[s.repoStack]) stackMap[s.repoStack] = { total: 0, approved: 0 }
        stackMap[s.repoStack].total++
        if (s.status === "APPROVED") stackMap[s.repoStack].approved++
    })
    const stackBarData = Object.entries(stackMap).map(([stack, counts]) => ({
        stack,
        Submitted: counts.total,
        Approved: counts.approved,
    }))

    // submissions over time — group by month (last 6 months)
    const monthlyMap: Record<string, number> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" })
        monthlyMap[key] = 0
    }
    allSubmissions.forEach((s) => {
        const d = new Date(s.createdAt)
        const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" })
        if (key in monthlyMap) monthlyMap[key]++
    })
    const monthlyData = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }))

    const statCards = [
        { label: "Total Submitted", value: total, icon: FolderGit2, color: "text-primary", bg: "bg-primary/10" },
        { label: "Pending Review", value: pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Approved", value: approved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Rejected", value: rejected, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    ]

    const Skeleton = ({ h = "h-52" }: { h?: string }) => (
        <div className={`${h} w-full rounded-xl bg-muted/50 animate-pulse`} />
    )

    const hasSubmissions = !loading && total > 0

    return (
        <div className="mx-auto space-y-8">

            {/* ── Greeting ── */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Welcome back, {user?.name?.split(" ")[0]}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {loading ? "Loading your stats…" : total === 0
                        ? "Submit your first project to get started."
                        : `${approvalRate}% approval rate across ${total} submission${total !== 1 ? "s" : ""}.`}
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className={`flex size-9 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`size-4 ${color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">
                                {loading
                                    ? <span className="inline-block w-6 h-6 rounded bg-muted animate-pulse" />
                                    : value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts (only when there's data) ── */}
            {(loading || hasSubmissions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Status breakdown — Donut */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Status Breakdown</p>
                            <p className="text-xs text-muted-foreground">How your submissions are progressing</p>
                        </div>
                        {loading ? <Skeleton /> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={statusPieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                        labelLine={false}
                                    >
                                        {statusPieData.map((entry) => (
                                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toUpperCase()]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Submissions over time — Bar */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Activity (Last 6 Months)</p>
                            <p className="text-xs text-muted-foreground">Number of projects submitted per month</p>
                        </div>
                        {loading ? <Skeleton /> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={monthlyData} barSize={28}>
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                                    <Bar dataKey="count" name="Submissions" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            )}

            {/* ── Stack performance (only if 2+ stacks used) ── */}
            {(loading || (hasSubmissions && stackBarData.length > 1)) && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Performance by Stack</p>
                        <p className="text-xs text-muted-foreground">Total submitted vs approved per tech stack</p>
                    </div>
                    {loading ? <Skeleton h="h-44" /> : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={stackBarData} barSize={20} barGap={4}>
                                <XAxis dataKey="stack" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>}
                                />
                                <Bar dataKey="Submitted" fill={STACK_COLORS[0]} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Approved" fill={STACK_COLORS[1]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}

            {/* ── Approval progress bar ── */}
            {hasSubmissions && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Approval Rate</p>
                            <p className="text-xs text-muted-foreground">
                                {approved} approved · {rejected} rejected · {pending} pending
                            </p>
                        </div>
                        <span className={`text-2xl font-bold ${approvalRate >= 60 ? "text-emerald-500" : approvalRate >= 30 ? "text-amber-500" : "text-rose-500"}`}>
                            {approvalRate}%
                        </span>
                    </div>
                    <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-rose-500 transition-all duration-700"
                            style={{ width: `${total > 0 ? Math.round((rejected / total) * 100) : 0}%` }}
                        />
                        <div
                            className="absolute top-0 h-full bg-emerald-500 transition-all duration-700"
                            style={{
                                left: `${total > 0 ? Math.round((rejected / total) * 100) : 0}%`,
                                width: `${approvalRate}%`,
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500 inline-block" /> Approved ({approved})</span>
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-500 inline-block" /> Rejected ({rejected})</span>
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-500 inline-block" /> Pending ({pending})</span>
                    </div>
                </div>
            )}

            {/* ── Recent Submissions ── */}
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
                            <div key={i} className="h-14 rounded-xl border border-border bg-card animate-pulse" />
                        ))}
                    </div>
                ) : recent.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-12 text-center">
                        <FolderGit2 className="size-8 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-foreground">No submissions yet</p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            Submit your first project to get a mentor review.
                        </p>
                        <Button asChild size="sm" className="gap-1.5 cursor-pointer">
                            <Link href="/dashboard/student/submissions/new">
                                <PlusCircle className="size-3.5" /> Submit a project
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                        {recent.map((s) => (
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
