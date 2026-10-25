import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SubmissionStatus } from "@/types/submission"

const CONFIG: Record<SubmissionStatus, { label: string; icon: React.ComponentType<{ className?: string }>; classes: string }> = {
    PENDING: { label: "Pending", icon: Clock, classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    APPROVED: { label: "Approved", icon: CheckCircle2, classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    REJECTED: { label: "Rejected", icon: XCircle, classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
    const { label, icon: Icon, classes } = CONFIG[status]
    return (
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", classes)}>
            <Icon className="size-3" />
            {label}
        </span>
    )
}
