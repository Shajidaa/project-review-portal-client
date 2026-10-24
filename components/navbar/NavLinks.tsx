"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ROLE_NAVIGATION, NavItem } from "@/lib/navigation"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function NavLinks({ className }: { className?: string }) {
  // const { role } = useAuth()
  const pathname = usePathname()
  const items: NavItem[] = ROLE_NAVIGATION["MENTOR"]

  return (
    <nav className={cn("hidden md:flex items-center gap-1", className)} aria-label="Main Navigation">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
        const ItemIcon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all select-none",
              isActive
                ? "text-primary bg-primary/10 shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            )}
            title={item.description}
          >
            <ItemIcon
              className={cn(
                "size-4 transition-transform group-hover:scale-110",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span>{item.title}</span>

            {/* Optional status badge */}
            {item.badge && (
              <Badge
                variant={item.badgeVariant ?? "default"}
                className="text-[10px] px-1.5 py-0 h-4 ml-1"
              >
                {item.badge}
              </Badge>
            )}

            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
