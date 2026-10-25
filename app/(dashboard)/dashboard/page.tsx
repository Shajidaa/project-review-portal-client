"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function DashboardRedirectPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    React.useEffect(() => {
        if (isLoading) return
        if (!user) { router.replace("/login"); return }
        switch (user.role) {
            case "STUDENT": router.replace("/dashboard/student"); break
            case "MENTOR": router.replace("/dashboard/mentor"); break
            case "ADMIN": router.replace("/dashboard/admin"); break
            default: router.replace("/login")
        }
    }, [user, isLoading, router])

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
    )
}
