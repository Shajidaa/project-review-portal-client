"use client"

import { useAuth } from "@/contexts/auth-context"
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock,
    Compass,
    FolderGit2,
    PlusCircle,
    TrendingUp,
    XCircle,
} from "lucide-react"
import Link from "next/link"

const stats = [
    { label: "Total Submissions", value: "4", icon: FolderGit2, color: "text-sky-500", bg: "bg-sky-500/10" },
    { label: "Under Review", value: "2", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Approved", value: "1", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Needs Revision", value: "1", icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
]

const recentSubmissions = [
    { name: "E-Commerce Platform", stack: "Fullstack", status: "UNDER_REVIEW", date: "Oct 22, 2026" },
    { name: "Portfolio Site", stack: "Frontend", status: "APPROVED", date: "Oct 15, 2026" },
    { name: "REST API Service", stack: "Backend", status: "NEEDS_REVISION", date: "Oct 10, 2026" },
]

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
    UNDER_REVIEW: { label: "Under Review", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    APPROVED: { label: "Approved", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    NEEDS_REVISION: { label: "Needs Revision", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    PENDING: { label: "Pending", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
}

export default function StudentDashboardPage() {
    const { user } = useAuth()

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">
                        Welcome back, {user?.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Here's a summary of your project submissions and reviews.
                    </p>
                </div>
                <Link
                    href="/submissions/new"
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                >
                    <PlusCircle className="size-4" />
                    New Submission
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-5 space-y-3">
                        <div className={`flex size-9 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`size-5 ${color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{value}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Submissions */}
                <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <h2 className="text-sm font-semibold text-foreground">Recent Submissions</h2>
                        <Link href="/submissions/my" className="flex items-center gap-1 text-xs text-primary hover:underline">
                            View all <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-border">
                        {recentSubmissions.map((sub) => {
                            const s = STATUS_STYLES[sub.status]
                            return (
                                <div key={sub.name} className="flex items-center justify-between gap-4 px-5 py-3.5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <FolderGit2 className="size-4 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{sub.name}</p>
                                            <p className="text-xs text-muted-foreground">{sub.stack} · {sub.date}</p>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.className}`}>
                                        {s.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border">
                        <h2 className="text-sm font-semibold text-foreground">Quick Links</h2>
                    </div>
                    <div className="p-3 space-y-1">
                        {[
                            { title: "Submit New Project", href: "/submissions/new", icon: PlusCircle, color: "text-primary" },
                            { title: "My Submissions", href: "/submissions/my", icon: FolderGit2, color: "text-sky-500" },
                            { title: "Review Guidelines", href: "/guidelines", icon: BookOpen, color: "text-emerald-500" },
                            { title: "Explore Archive", href: "/explore", icon: Compass, color: "text-violet-500" },
                            { title: "Track Progress", href: "/submissions/stats", icon: TrendingUp, color: "text-amber-500" },
                        ].map(({ title, href, icon: Icon, color }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                <Icon className={`size-4 shrink-0 ${color}`} />
                                <span>{title}</span>
                                <ArrowRight className="size-3.5 ml-auto opacity-40" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
