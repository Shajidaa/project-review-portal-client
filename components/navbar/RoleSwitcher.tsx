"use client"

import * as React from "react"
import { Check, ChevronDown, GraduationCap, Shield, UserCheck, Users } from "lucide-react"
import { useAuth, ActiveRole } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const ROLES: {
  role: ActiveRole
  label: string
  badgeText: string
  icon: React.ComponentType<{ className?: string }>
  colorClass: string
  ringClass: string
  description: string
}[] = [
  {
    role: "STUDENT",
    label: "Student View",
    badgeText: "Student",
    icon: GraduationCap,
    colorClass: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    ringClass: "hover:border-sky-500/50",
    description: "Submit projects & track reviews",
  },
  {
    role: "MENTOR",
    label: "Mentor View",
    badgeText: "Mentor",
    icon: UserCheck,
    colorClass: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
    ringClass: "hover:border-violet-500/50",
    description: "Evaluate submissions & give feedback",
  },
  {
    role: "ADMIN",
    label: "Admin View",
    badgeText: "Admin",
    icon: Shield,
    colorClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    ringClass: "hover:border-amber-500/50",
    description: "Manage users, stats, & all projects",
  },
  {
    role: "GUEST",
    label: "Public / Guest",
    badgeText: "Guest",
    icon: Users,
    colorClass: "bg-muted text-muted-foreground border-border/80",
    ringClass: "hover:border-border",
    description: "Explore showcase & guidelines",
  },
]

export function RoleSwitcher({ className }: { className?: string }) {
  const { role, switchRole } = useAuth()
  const current = ROLES.find((r) => r.role === role) ?? ROLES[0]
  const Icon = current.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring select-none",
          current.colorClass,
          current.ringClass,
          className
        )}
        title="Switch portal role mode"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
        <Icon className="size-3.5" />
        <span>{current.badgeText}</span>
        <ChevronDown className="size-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Simulate Portal Role
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((r) => {
          const ItemIcon = r.icon
          const isSelected = r.role === role
          return (
            <DropdownMenuItem
              key={r.role}
              onClick={() => switchRole(r.role)}
              className={cn(
                "flex items-start gap-2.5 rounded-lg p-2 cursor-pointer transition-colors",
                isSelected ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 rounded-md border p-1",
                  r.colorClass
                )}
              >
                <ItemIcon className="size-3.5" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{r.label}</span>
                  {isSelected && <Check className="size-3.5 text-primary" />}
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  {r.description}
                </p>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
