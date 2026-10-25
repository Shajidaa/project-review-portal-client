"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/navbar/ThemeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export function DashboardNavbar({ onMenuClick }: { onMenuClick: () => void }) {
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    if (!user) return null

    // Derive page title from nav config + shared routes
    const navItems = ROLE_NAVIGATION[user.role] ?? []
    const currentNav = navItems.find(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    )
    const SHARED_TITLES: Record<string, string> = {
        "/dashboard/profile": "My Profile",
    }
    const pageTitle = currentNav?.title ?? SHARED_TITLES[pathname] ?? "Dashboard"

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    return (
        <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur-md px-5">
            {/* ── Left: hamburger (mobile) + page title ── */}
            <div className="flex items-center gap-2 min-w-0">
                <button
                    onClick={onMenuClick}
                    aria-label="Toggle menu"
                    className="md:hidden flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                    <Menu className="size-4.5" />
                </button>
                <h1 className="text-sm font-semibold text-foreground truncate">{pageTitle}</h1>
            </div>

            {/* ── Right controls ── */}
            <div className="flex items-center gap-1.5 shrink-0">



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
                        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer">
                            My Profile
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
