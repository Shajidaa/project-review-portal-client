import { RoleGuard } from "@/components/auth/RoleGuard"
import { DashboardShell } from "@/components/dashboard/DashboardShell"

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRole="STUDENT">
            <DashboardShell>{children}</DashboardShell>
        </RoleGuard>
    )
}
