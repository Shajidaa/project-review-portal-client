import { RoleGuard } from "@/components/auth/RoleGuard"
import { DashboardShell } from "@/components/dashboard/DashboardShell"

export default function MentorDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRole="MENTOR">
            <DashboardShell>{children}</DashboardShell>
        </RoleGuard>
    )
}
