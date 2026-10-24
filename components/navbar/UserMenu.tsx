"use client"

import * as React from "react"
import Link from "next/link"
import {
  BookOpen,
  FolderGit2,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  // const { user, logout, role } = useAuth()
  const user = {
    name: "John Doe",
    email: "[EMAIL_ADDRESS]",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  }
  const role = "MENTOR"


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  // const getRoleBadgeVariant = () => {
  //   switch (role) {
  //     case "STUDENT":
  //       return "info"
  //     case "MENTOR":
  //       return "purple"
  //     case "ADMIN":
  //       return "warning"
  //     default:
  //       return "default"
  //   }
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group relative flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none cursor-pointer">
        <div className="relative">
          <Avatar className="size-9 ring-2 ring-primary/20 transition-all group-hover:ring-primary/50 group-hover:scale-105">
            {user.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            )}
            <AvatarFallback className="font-semibold text-xs bg-gradient-to-tr from-primary/20 to-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {/* Active online status badge */}
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1.5 shadow-2xl">
        {/* User Identity Header */}
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground leading-none">
                {user.name}
              </p>
              {/* <Badge variant={getRoleBadgeVariant()} className="text-[10px] px-1.5 py-0.5 uppercase tracking-wider">
                {role}
              </Badge> */}
            </div>
            <p className="text-xs text-muted-foreground truncate leading-none pt-0.5">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Navigation Group */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2.5 cursor-pointer">
              <User className="size-4 text-muted-foreground" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          {/* 
          {role === "STUDENT" && (
            <DropdownMenuItem asChild>
              <Link href="/submissions/my" className="flex items-center gap-2.5 cursor-pointer">
                <FolderGit2 className="size-4 text-sky-500" />
                <span>My Submissions</span>
              </Link>
            </DropdownMenuItem>
          )} */}

          {role === "MENTOR" && (
            <DropdownMenuItem asChild>
              <Link href="/submissions" className="flex items-center gap-2.5 cursor-pointer">
                <FolderGit2 className="size-4 text-violet-500" />
                <span>Review Queue</span>
              </Link>
            </DropdownMenuItem>
          )}

          {/* {role === "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2.5 cursor-pointer">
                <Sparkles className="size-4 text-amber-500" />
                <span>Admin Console</span>
              </Link>
            </DropdownMenuItem>
          )} */}

          <DropdownMenuItem asChild>
            <Link href="/guidelines" className="flex items-center gap-2.5 cursor-pointer">
              <BookOpen className="size-4 text-muted-foreground" />
              <span>Review Rubrics</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2.5 cursor-pointer">
              <Settings className="size-4 text-muted-foreground" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        {/* <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
