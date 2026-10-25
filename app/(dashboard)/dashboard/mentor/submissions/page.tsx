import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable"

export default function MentorSubmissionsPage() {
    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-xl font-bold text-foreground">Review Queue</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    All submitted projects. Filter by status or search by name.
                </p>
            </div>
            <SubmissionsTable detailBase="/dashboard/mentor/submissions" />
        </div>
    )
}
