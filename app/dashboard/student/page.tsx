"use client"

import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Compass, FolderGit2, LayoutDashboard } from "lucide-react"
import Link from "next/link"

const cards = [
    {
        title: "My Submissions",
        description: "Track your submission status, approvals, and review feedback.",
        href: "/submissions/my",
        icon: FolderGit2,
        color: "text-sky-500",
        bg: "bg-sky-500/10",
    },
    {
        title: "Guidelines & Rubric",
        description: "Standards and best practices for project reviews.",
        href: "/guidelines",
        icon: BookOpen,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "Explore Archive",
        description: "See exemplary student projects and mentor reviews.",
        href: "/explore",
        icon: Compass,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    },
]

export default function StudentDashboardPage() {
    const { user } = useAuth()

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
                    <LayoutDashboard className="size-5 text-sky-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">
                        Welcome back, {user?.name?.split(" ")[0]}
                    </h1>
                    <p className="text-sm text-muted-foreground">Student Dashboard</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cards.map(({ title, description, href, icon: Icon, color, bg }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                    >
                        <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`size-5 ${color}`} />
                        </div>
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-snug">{description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
