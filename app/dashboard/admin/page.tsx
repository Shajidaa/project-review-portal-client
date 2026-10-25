"use client"

import { useAuth } from "@/contexts/auth-context"
import { BarChart2, LayoutDashboard, ShieldCheck, Users } from "lucide-react"
import Link from "next/link"

const cards = [
    {
        title: "All Submissions",
        description: "Oversee every project submission across all students and mentors.",
        href: "/admin/submissions",
        icon: LayoutDashboard,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        title: "User Management",
        description: "Manage student and mentor accounts, roles, and access.",
        href: "/admin/users",
        icon: Users,
        color: "text-sky-500",
        bg: "bg-sky-500/10",
    },
    {
        title: "Platform Stats",
        description: "Review submission volume, review rates, and platform activity.",
        href: "/admin/stats",
        icon: BarChart2,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    },
    {
        title: "Access Control",
        description: "Configure role permissions and platform-wide settings.",
        href: "/admin/settings",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
]

export default function AdminDashboardPage() {
    const { user } = useAuth()

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <LayoutDashboard className="size-5 text-amber-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">
                        Welcome back, {user?.name?.split(" ")[0]}
                    </h1>
                    <p className="text-sm text-muted-foreground">Admin Dashboard</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
