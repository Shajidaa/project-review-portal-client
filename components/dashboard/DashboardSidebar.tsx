"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, Code2, LogOut, User as UserIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ROLE_NAVIGATION } from "@/lib/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/types/auth"

const ROLE_LABELS: Record<UserRole, string> = {
    STUDENT: "Student",
    MENTOR: "Mentor",
    ADMIN: "Admin",
}

const ROLE_COLORS: Record<UserRole, string> = {
    STUDENT: "text-sky-500",
    MENTOR: "text-violet-500",
    ADMIN: "text-amber-500",
}

const ROLE_DOT: Record<UserRole, string> = {
    STUDENT: "bg-sky-500",
    MENTOR: "bg-violet-500",
    ADMIN: "bg-amber-500",
}

export function DashboardSidebar() {
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = React.useState(false)

    if (!user) return null

    const navItems = ROLE_NAVIGATION[user.role] ?? []

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    return (
        <aside
            className={cn(
                "relative flex flex-col h-full border-r border-border bg-card transition-all duration-300 ease-in-out",
                collapsed ? "w-[68px]" : "w-[240px]"
            )}
        >
            {/* ── Collapse Toggle ── */}
            <button
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute -right-3.5 top-[72px] z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground hover:shadow-md transition-all cursor-pointer"
            >
                {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
            </button>

            {/* ── Brand ── */}
            <div className={cn("flex h-16 items-center border-b border-border px-4 shrink-0", collapsed && "justify-center px-0")}>
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-primary via-indigo-600 to-violet-500 text-white shadow-sm shadow-primary/20 transition-transform group-hover:scale-105">
                        <Code2 className="size-4" />
                    </div>
                    {!collapsed && (
                        <span className="text-base font-bold tracking-tight text-foreground whitespace-nowrap">
                            Dev<span className="text-primary">Review</span>
                        </span>
                    )}
                </Link>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.title : undefined}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                collapsed && "justify-center px-0"
                            )}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary" />
                            )}

                            <Icon className={cn("size-4.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />

                            {!collapsed && (
                                <span className="truncate leading-none">{item.title}</span>
                            )}

                            {!collapsed && item.badge && (
                                <span className={cn(
                                    "ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                                    item.badgeVariant === "warning" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                                    item.badgeVariant === "info" && "bg-sky-500/15 text-sky-600 dark:text-sky-400",
                                    item.badgeVariant === "success" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                                    (!item.badgeVariant || item.badgeVariant === "default") && "bg-muted text-muted-foreground",
                                )}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* ── User Footer ── */}
            <div className={cn(
                "shrink-0 border-t border-border p-3",
                collapsed ? "flex flex-col items-center gap-2" : "space-y-1"
            )}>
                {/* Clickable user row → profile page */}
                <Link
                    href="/dashboard/profile"
                    title={collapsed ? "My Profile" : undefined}
                    className={cn(
                        "flex items-center gap-2.5 min-w-0 rounded-lg px-2 py-2 hover:bg-muted transition-colors",
                        collapsed && "justify-center px-0",
                        pathname === "/dashboard/profile" && "bg-primary/10"
                    )}
                >
                    <div className="relative shrink-0">
                        <Avatar className="size-8">
                            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                            <AvatarFallback className="text-xs font-semibold bg-gradient-to-tr from-primary/20 to-primary/10 text-primary">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className={cn("absolute bottom-0 right-0 size-2 rounded-full ring-1 ring-background", ROLE_DOT[user.role])} />
                    </div>

                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-foreground leading-none">{user.name}</p>
                            <p className={cn("text-[11px] font-medium mt-0.5", ROLE_COLORS[user.role])}>
                                {ROLE_LABELS[user.role]}
                            </p>
                        </div>
                    )}

                    {!collapsed && (
                        <UserIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                </Link>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    title={collapsed ? "Log out" : undefined}
                    className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full cursor-pointer",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <LogOut className="size-4 shrink-0" />
                    {!collapsed && <span>Log out</span>}
                </button>
            </div>
        </aside>
    )
}
