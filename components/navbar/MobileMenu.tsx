"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ROLE_NAVIGATION } from "@/lib/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { ThemeToggle } from "./ThemeToggle"
import { cn } from "@/lib/utils"

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false)

  const pathname = usePathname()
  const items = ROLE_NAVIGATION["MENTOR"]

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="md:hidden flex items-center gap-1.5">
      <ThemeToggle />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[65px] z-50 bg-background/95 backdrop-blur-xl border-t border-border/60 p-4 overflow-y-auto animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col h-full max-w-md mx-auto space-y-5 pb-12">
            {/* Top Bar inside Menu: Role & User Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Portal View
              </span>

            </div>

            {/* Authenticated User Banner or Guest Welcome */}
            {/* {isAuthenticated && user ? (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/80 bg-accent/40">
                <Avatar className="size-11 ring-2 ring-primary/20">
                  {user.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  )}
                  <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase">
                      {role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-accent/30 to-background">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <Sparkles className="size-4" />
                  <span>DevReview Portal</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Submit code repositories for review, receive actionable feedback, and track your engineering progress.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      loginAs("STUDENT")
                      setIsOpen(false)
                    }}
                    size="sm"
                    className="w-full text-xs shadow-xs"
                  >
                    <LogIn className="size-3.5 mr-1.5" />
                    Student Log In
                  </Button>
                  <Button
                    onClick={() => {
                      loginAs("MENTOR")
                      setIsOpen(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Mentor Log In
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              <p className="px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Navigation
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href
                  const ItemIcon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-1.5 rounded-lg border",
                            isActive
                              ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                              : "border-border/60 bg-background text-muted-foreground"
                          )}
                        >
                          <ItemIcon className="size-4" />
                        </div>
                        <div>
                          <p>{item.title}</p>
                          {item.description && (
                            <p
                              className={cn(
                                "text-[11px] line-clamp-1 font-normal",
                                isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                              )}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : (item.badgeVariant ?? "default")}
                          className="text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Primary Action Button Based on Role */}
            {/* <div className="pt-2">
              {role === "STUDENT" && (
                <Button asChild className="w-full gap-2 shadow-sm" size="lg">
                  <Link href="/submissions/new" onClick={() => setIsOpen(false)}>
                    <PlusCircle className="size-4" />
                    <span>Submit New Project</span>
                  </Link>
                </Button>
              )}

              {role === "MENTOR" && (
                <Button asChild className="w-full gap-2 shadow-sm bg-violet-600 hover:bg-violet-700" size="lg">
                  <Link href="/submissions" onClick={() => setIsOpen(false)}>
                    <FolderGit2 className="size-4" />
                    <span>Open Review Queue (3)</span>
                  </Link>
                </Button>
              )}

              {role === "ADMIN" && (
                <Button asChild className="w-full gap-2 shadow-sm bg-amber-600 hover:bg-amber-700 text-white" size="lg">
                  <Link href="/admin/users" onClick={() => setIsOpen(false)}>
                    <GraduationCap className="size-4" />
                    <span>Manage User Access</span>
                  </Link>
                </Button>
              )}

              {role === "GUEST" && (
                <Button asChild className="w-full gap-2 shadow-sm" size="lg">
                  <Link href="/explore" onClick={() => setIsOpen(false)}>
                    <Sparkles className="size-4" />
                    <span>Explore Project Showcase</span>
                  </Link>
                </Button>
              )}
            </div> */}

            {/* Bottom Actions 
            {isAuthenticated && (
              <div className="pt-4 border-t border-border/60">
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 font-medium px-2 py-1.5 transition-colors"
                >
                  <LogOut className="size-4" />
                  <span>Log out of portal</span>
                </button>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  )
}
