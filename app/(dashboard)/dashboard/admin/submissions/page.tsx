import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable"

export default function AdminSubmissionsPage() {
    return (
        <div className="mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-bold text-foreground">All Submissions</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Platform-wide view of every student submission. Search, filter, and review.
                </p>
            </div>
            <SubmissionsTable detailBase="/dashboard/admin/submissions" />
        </div>
    )
}
