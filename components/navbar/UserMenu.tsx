"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Student",
  MENTOR: "Mentor",
  ADMIN: "Admin",
}

const ROLE_COLORS: Record<string, string> = {
  STUDENT: "text-sky-500",
  MENTOR: "text-violet-500",
  ADMIN: "text-amber-500",
}

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group relative flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none cursor-pointer">
        <div className="relative">
          <Avatar className="size-9 ring-2 ring-primary/20 transition-all group-hover:ring-primary/50 group-hover:scale-105">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="font-semibold text-xs bg-gradient-to-tr from-primary/20 to-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1.5 shadow-2xl">
        {/* User Identity Header */}
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 ring-2 ring-primary/20">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
              <AvatarFallback className="font-semibold text-sm bg-gradient-to-tr from-primary/20 to-primary/10 text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-foreground leading-none truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate leading-none pt-1">
                {user.email}
              </p>
              <span className={`text-[11px] font-medium mt-1 ${ROLE_COLORS[user.role] ?? "text-muted-foreground"}`}>
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2.5 cursor-pointer">
              <LayoutDashboard className="size-4 text-muted-foreground" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2.5 cursor-pointer">
              <User className="size-4 text-muted-foreground" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>

          {user.role === "STUDENT" && (
            <DropdownMenuItem asChild>
              <Link href="/submissions/my" className="flex items-center gap-2.5 cursor-pointer">
                <FolderGit2 className="size-4 text-sky-500" />
                <span>My Submissions</span>
              </Link>
            </DropdownMenuItem>
          )}

          {user.role === "MENTOR" && (
            <DropdownMenuItem asChild>
              <Link href="/submissions" className="flex items-center gap-2.5 cursor-pointer">
                <FolderGit2 className="size-4 text-violet-500" />
                <span>Review Queue</span>
              </Link>
            </DropdownMenuItem>
          )}

          {user.role === "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2.5 cursor-pointer">
                <ShieldCheck className="size-4 text-amber-500" />
                <span>Admin Console</span>
              </Link>
            </DropdownMenuItem>
          )}

          {/* <DropdownMenuItem asChild>
            <Link href="/guidelines" className="flex items-center gap-2.5 cursor-pointer">
              <BookOpen className="size-4 text-muted-foreground" />
              <span>Review Rubrics</span>
            </Link>
          </DropdownMenuItem> */}

          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2.5 cursor-pointer">
              <Settings className="size-4 text-muted-foreground" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
