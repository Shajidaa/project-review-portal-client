import { RoleGuard } from "@/components/auth/RoleGuard"
import { DashboardShell } from "@/components/dashboard/DashboardShell"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRole="ADMIN">
            <DashboardShell>{children}</DashboardShell>
        </RoleGuard>
    )
}
