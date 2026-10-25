import { SubmissionDetailView } from "@/components/dashboard/SubmissionDetailView"

export default function MentorSubmissionDetailPage() {
    return (
        <SubmissionDetailView
            backHref="/dashboard/mentor/submissions"
            backLabel="Back to review queue"
        />
    )
}
