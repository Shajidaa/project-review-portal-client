import { RoleGuard } from "@/components/auth/RoleGuard"

export default function MentorDashboardLayout({ children }: { children: React.ReactNode }) {
    return <RoleGuard allowedRole="MENTOR">{children}</RoleGuard>
}
