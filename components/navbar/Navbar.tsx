"use client"

import * as React from "react"
import Link from "next/link"
import { Code2, LogIn, UserPlus } from "lucide-react"
import MyContainer from "@/components/shared/myContainer"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  // Track scroll state for elevation and blur
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 12) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-xs"
          : "bg-background/70 backdrop-blur-md border-b border-border/50"
      )}
    >
      <MyContainer>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ── Brand Logo ── */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform active:scale-95"
            aria-label="DevReview Home"
          >
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-violet-500 text-white shadow-md shadow-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-105">
              <Code2 className="size-5 transition-transform duration-300 group-hover:rotate-6" />
              <span className="absolute -top-1 -right-1 flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-bold tracking-tight text-foreground font-sans">
                  Dev<span className="text-primary font-black">Review</span>
                </span>

              </div>

            </div>
          </Link>

          {/* ── Right Actions: Theme Toggle, Sign In, Sign Up ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              <Link href="/login" className="flex items-center gap-1.5">
                <LogIn className="size-4" />
                <span>Sign In</span>
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="text-xs sm:text-sm font-medium gap-1.5 shadow-sm shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Link href="/register" className="flex items-center gap-1.5">
                <UserPlus className="size-4" />
                <span>Sign Up</span>
              </Link>
            </Button>
          </div>
        </div>
      </MyContainer>
    </header>
  )
}

export default Navbar
