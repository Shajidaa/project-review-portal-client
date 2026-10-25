"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/navbar/ThemeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ROLE_NAVIGATION } from "@/lib/navigation"
import type { UserRole } from "@/types/auth"

const ROLE_COLORS: Record<UserRole, string> = {
    STUDENT: "text-sky-500",
    MENTOR: "text-violet-500",
    ADMIN: "text-amber-500",
}

const ROLE_BG: Record<UserRole, string> = {
    STUDENT: "bg-sky-500/10",
    MENTOR: "bg-violet-500/10",
    ADMIN: "bg-amber-500/10",
}

export function DashboardNavbar() {
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    if (!user) return null

    // Derive page title from nav config
    const navItems = ROLE_NAVIGATION[user.role] ?? []
    const currentNav = navItems.find(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    )
    const pageTitle = currentNav?.title ?? "Dashboard"

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    return (
        <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur-md px-5">
            {/* ── Page Title ── */}
            <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-sm font-semibold text-foreground truncate">{pageTitle}</h1>
            </div>

            {/* ── Right controls ── */}
            <div className="flex items-center gap-1.5 shrink-0">
                {/* Search */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
                    aria-label="Search"
                >
                    <Search className="size-4" />
                </Button>

                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-9 rounded-lg text-muted-foreground hover:text-foreground"
                    aria-label="Notifications"
                >
                    <Bell className="size-4" />
                    {/* Unread dot */}
                    <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
                </Button>

                <ThemeToggle />

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <Avatar className="size-7">
                                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                                <AvatarFallback className={cn("text-[10px] font-bold", ROLE_BG[user.role], ROLE_COLORS[user.role])}>
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex flex-col items-start leading-none">
                                <span className="text-xs font-semibold text-foreground">{user.name.split(" ")[0]}</span>
                                <span className={cn("text-[10px] font-medium", ROLE_COLORS[user.role])}>
                                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                                </span>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-0.5">
                                <p className="text-sm font-semibold">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                            My Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                            Account Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
