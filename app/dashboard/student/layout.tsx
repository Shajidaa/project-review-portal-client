import { RoleGuard } from "@/components/auth/RoleGuard"

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
    return <RoleGuard allowedRole="STUDENT">{children}</RoleGuard>
}
