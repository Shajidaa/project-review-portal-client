"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { submissionApi } from "@/lib/submission-api"
import { userApi } from "@/lib/user-api"
import type { Submission, SubmissionStats } from "@/types/submission"
import {
    ArrowRight,
    BarChart2,
    CheckCircle2,
    Clock,
    ExternalLink,
    FolderGit2,
    TrendingUp,
    Users2,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmissionStatusBadge } from "@/components/dashboard/SubmissionStatusBadge"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"

/* ── Colour tokens that work in both themes ─────────────────────────────── */
const COLORS = {
    primary: "hsl(var(--primary))",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
    sky: "#0ea5e9",
    violet: "#8b5cf6",
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: COLORS.amber,
    APPROVED: COLORS.emerald,
    REJECTED: COLORS.rose,
}

const TYPE_COLORS = [COLORS.primary, COLORS.sky, COLORS.violet]
const ROLE_COLORS = [COLORS.sky, COLORS.violet, COLORS.amber]

/* ── Shared tooltip style ───────────────────────────────────────────────── */
const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
}

interface UserCounts { students: number; mentors: number; admins: number; total: number }

export default function AdminDashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = React.useState<SubmissionStats | null>(null)
    const [userCounts, setUserCounts] = React.useState<UserCounts | null>(null)
    const [recent, setRecent] = React.useState<Submission[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        Promise.all([
            submissionApi.getStats(),
            submissionApi.getAll({ limit: 5 }),
            // fetch role counts in parallel — each returns meta.total
            userApi.getAll({ limit: 1, role: "STUDENT" }),
            userApi.getAll({ limit: 1, role: "MENTOR" }),
            userApi.getAll({ limit: 1, role: "ADMIN" }),
        ]).then(([statsRes, listRes, stuRes, menRes, admRes]) => {
            setStats(statsRes.data)
            setRecent(listRes.data)
            const students = stuRes.meta?.total ?? 0
            const mentors = menRes.meta?.total ?? 0
            const admins = admRes.meta?.total ?? 0
            setUserCounts({ students, mentors, admins, total: students + mentors + admins })
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    /* ── Derived chart data ────────────────────────────────────────────────── */
    const statusData = stats
        ? [
            { name: "Pending", value: stats.pending },
            { name: "Approved", value: stats.approved },
            { name: "Rejected", value: stats.rejected },
        ]
        : []

    const typeData = stats?.byProjectType.map(({ type, count }) => ({
        name: type,
        count,
    })) ?? []

    const userRoleData = userCounts
        ? [
            { name: "Students", value: userCounts.students },
            { name: "Mentors", value: userCounts.mentors },
            { name: "Admins", value: userCounts.admins },
        ]
        : []

    /* ── Stat cards ─────────────────────────────────────────────────────────── */
    const statCards = [
        { label: "Total Submissions", value: stats?.total, icon: FolderGit2, color: "text-primary", bg: "bg-primary/10" },
        { label: "Pending", value: stats?.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Approved", value: stats?.approved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Rejected", value: stats?.rejected, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
        { label: "Approval Rate", value: stats ? `${stats.approvalRate}%` : undefined, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10" },
        { label: "Total Users", value: userCounts?.total, icon: Users2, color: "text-sky-500", bg: "bg-sky-500/10" },
    ]

    const Skeleton = ({ h = "h-full" }: { h?: string }) => (
        <div className={`${h} w-full rounded-xl bg-muted/50 animate-pulse`} />
    )

    return (
        <div className="mx-auto space-y-8">

            {/* ── Greeting ── */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Welcome back, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Platform overview at a glance.</p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className={`flex size-8 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`size-4 ${color}`} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-foreground">
                                {loading
                                    ? <span className="inline-block w-8 h-5 rounded bg-muted animate-pulse" />
                                    : (value ?? 0)}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts Row 1: Status Pie + Type Bar ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Submission Status — Pie */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Submission Status</p>
                        <p className="text-xs text-muted-foreground">Distribution by review outcome</p>
                    </div>
                    {loading ? <Skeleton h="h-52" /> : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {statusData.map((entry) => (
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

                {/* Project Type — Bar */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Submissions by Type</p>
                        <p className="text-xs text-muted-foreground">WEB · MOBILE · OTHER</p>
                    </div>
                    {loading ? <Skeleton h="h-52" /> : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={typeData} barSize={36}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {typeData.map((_, i) => (
                                        <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
                {/* User Roles — Pie */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Users by Role</p>
                        <p className="text-xs text-muted-foreground">Students · Mentors · Admins</p>
                    </div>
                    {loading ? <Skeleton h="h-52" /> : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={userRoleData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {userRoleData.map((_, i) => (
                                        <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />
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

                {/* Approval summary — stacked bar */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Review Summary</p>
                        <p className="text-xs text-muted-foreground">Approved vs Rejected vs Pending</p>
                    </div>
                    {loading ? <Skeleton h="h-52" /> : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                data={[{ name: "Submissions", ...stats }]}
                                layout="vertical"
                                barSize={28}
                            >
                                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(v) => <span className="text-xs text-muted-foreground capitalize">{v}</span>}
                                />
                                <Bar dataKey="approved" name="Approved" stackId="a" fill={COLORS.emerald} radius={[0, 0, 0, 0]} />
                                <Bar dataKey="rejected" name="Rejected" stackId="a" fill={COLORS.rose} radius={[0, 0, 0, 0]} />
                                <Bar dataKey="pending" name="Pending" stackId="a" fill={COLORS.amber} radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>



            {/* ── Approval Rate Progress ── */}
            {stats && !loading && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Approval Rate</p>
                            <p className="text-xs text-muted-foreground">
                                {stats.approved} approved out of {stats.total} total submissions
                            </p>
                        </div>
                        <span className="text-2xl font-bold text-emerald-500">{stats.approvalRate}%</span>
                    </div>
                    <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                        {/* rejected */}
                        <div
                            className="absolute left-0 top-0 h-full bg-rose-500 transition-all duration-700"
                            style={{ width: `${stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%` }}
                        />
                        {/* approved — starts after rejected */}
                        <div
                            className="absolute top-0 h-full bg-emerald-500 transition-all duration-700"
                            style={{
                                left: `${stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%`,
                                width: `${stats.approvalRate}%`,
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500 inline-block" /> Approved ({stats.approved})</span>
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-500 inline-block" /> Rejected ({stats.rejected})</span>
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-500 inline-block" /> Pending ({stats.pending})</span>
                    </div>
                </div>
            )}

            {/* ── Recent Submissions ── */}
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
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-14 rounded-xl border border-border bg-card animate-pulse" />
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
