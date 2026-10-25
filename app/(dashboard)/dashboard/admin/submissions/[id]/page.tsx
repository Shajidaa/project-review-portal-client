import { SubmissionDetailView } from "@/components/dashboard/SubmissionDetailView"

export default function AdminSubmissionDetailPage() {
    return (
        <SubmissionDetailView
            backHref="/dashboard/admin/submissions"
            backLabel="Back to all submissions"
        />
    )
}
