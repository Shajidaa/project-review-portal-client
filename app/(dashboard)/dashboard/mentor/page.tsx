"use client"

import { useAuth } from "@/contexts/auth-context"
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock,
    FolderGit2,
    Star,
    TrendingUp,
    Users2,
    Compass,
    LayoutDashboard
} from "lucide-react"
import Link from "next/link"

const stats = [
    { label: "Pending Reviews", value: "3", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Completed Reviews", value: "28", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg. Turnaround", value: "1.4d", icon: TrendingUp, color: "text-sky-500", bg: "bg-sky-500/10" },
    {
        label: "Students Helped",
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    },
    {
        title: "Review Guidelines",
        description: "Rubrics and standards to guide consistent, high-quality feedback.",
        href: "/guidelines",
        icon: BookOpen,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "Archive",
        description: "Browse past reviews and approved student projects.",
        href: "/explore",
        icon: Compass,
        color: "text-sky-500",
        bg: "bg-sky-500/10",
    },
]

export default function MentorDashboardPage() {
    const { user } = useAuth()

    return (
        <div className="max-w-3xl space-y-8">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10">
                    <LayoutDashboard className="size-5 text-violet-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">
                        Welcome back, {user?.name?.split(" ")[0]}
                    </h1>
                    <p className="text-sm text-muted-foreground">Your review queue is ready.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map(({ title, description, href, icon: Icon, color, bg }: any) => (
                    <Link
                        key={href}
                        href={href}
                        className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                    >
                        <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`size-5 ${color}`} />
                        </div>
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{title}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-snug">{description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
