import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/auth"

const CONFIG: Record<UserRole, { label: string; classes: string }> = {
    STUDENT: { label: "Student", classes: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
    MENTOR: { label: "Mentor", classes: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    ADMIN: { label: "Admin", classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
}

export function UserRoleBadge({ role }: { role: UserRole }) {
    const { label, classes } = CONFIG[role] ?? { label: role, classes: "bg-muted text-muted-foreground" }
    return (
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold", classes)}>
            {label}
        </span>
    )
}
