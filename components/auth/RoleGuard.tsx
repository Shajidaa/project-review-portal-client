"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/types/auth"

interface RoleGuardProps {
    allowedRole: UserRole
    children: React.ReactNode
}

export function RoleGuard({ allowedRole, children }: RoleGuardProps) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    React.useEffect(() => {
        if (isLoading) return

        if (!user) {
            router.replace("/login")
            return
        }

        if (user.role !== allowedRole) {
            // Redirect to their own dashboard
            switch (user.role) {
                case "STUDENT":
                    router.replace("/dashboard/student")
                    break
                case "MENTOR":
                    router.replace("/dashboard/mentor")
                    break
                case "ADMIN":
                    router.replace("/dashboard/admin")
                    break
            }
        }
    }, [user, isLoading, allowedRole, router])

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user || user.role !== allowedRole) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return <>{children}</>
}
