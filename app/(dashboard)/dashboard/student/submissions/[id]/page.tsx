"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { submissionApi } from "@/lib/submission-api"
import type { Submission } from "@/types/submission"
import {
    ArrowLeft,
    ExternalLink,
    Calendar,
    Code2,
    Globe,
    Layers,
    MessageSquare,
    Trash2,
    Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmissionStatusBadge } from "@/components/dashboard/SubmissionStatusBadge"
import Link from "next/link"

function InfoRow({ icon: Icon, label, value, href }: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    href?: string
}) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
            <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline truncate block mt-0.5 flex items-center gap-1">
                        {value} <ExternalLink className="size-3 inline-block" />
                    </a>
                ) : (
                    <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                )}
            </div>
        </div>
    )
}

export default function SubmissionDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [submission, setSubmission] = React.useState<Submission | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [deleting, setDeleting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        submissionApi.getMyById(id)
            .then((res) => setSubmission(res.data))
            .catch((e) => setError((e as Error).message))
            .finally(() => setLoading(false))
    }, [id])

    const handleDelete = async () => {
        if (!confirm("Delete this submission? This cannot be undone.")) return
        setDeleting(true)
        try {
            await submissionApi.deleteMy(id)
            router.push("/dashboard/student/submissions")
        } catch (e: unknown) {
            alert((e as Error).message ?? "Failed to delete")
            setDeleting(false)
        }
    }

    if (loading) return (
        <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
    )

    if (error || !submission) return (
        <div className="max-w-2xl space-y-4">
            <Link href="/dashboard/student/submissions"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-3.5" /> Back
            </Link>
            <p className="text-sm text-destructive">{error ?? "Submission not found."}</p>
        </div>
    )

    return (
        <div className="max-w-2xl space-y-6">
            {/* Back */}
            <Link href="/dashboard/student/submissions"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="size-3.5" /> Back to submissions
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                    <h1 className="text-xl font-bold text-foreground truncate">{submission.projectName}</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <SubmissionStatusBadge status={submission.status} />
                        <span className="text-xs text-muted-foreground">{submission.repoStack} · {submission.projectType}</span>
                    </div>
                </div>
                {submission.status === "PENDING" && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 gap-1.5 cursor-pointer"
                    >
                        {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        Delete
                    </Button>
                )}
            </div>

            {/* Project image */}
            {submission.projectImage && (
                <div className="rounded-xl overflow-hidden border border-border">
                    <img src={submission.projectImage} alt={submission.projectName} className="w-full object-cover max-h-52" />
                </div>
            )}

            {/* Details card */}
            <div className="rounded-xl border border-border bg-card px-4 divide-y divide-border">
                <InfoRow icon={Code2} label="Repository" value={submission.repoUrl} href={submission.repoUrl} />
                <InfoRow icon={Globe} label="Live Demo" value={submission.liveLink} href={submission.liveLink} />
                <InfoRow icon={Layers} label="Stack" value={`${submission.repoStack} · ${submission.projectType}`} />
                <InfoRow icon={Calendar} label="Submitted on" value={new Date(submission.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                {submission.reviewedBy && (
                    <InfoRow icon={Code2} label="Reviewed by" value={submission.reviewedBy.name} />
                )}
                {submission.reviewedAt && (
                    <InfoRow icon={Calendar} label="Reviewed on" value={new Date(submission.reviewedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                )}
            </div>

            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{submission.description}</p>
            </div>

            {/* Review feedback */}
            {submission.reviewComments && (
                <div className={`rounded-xl border p-4 space-y-2 ${submission.status === "APPROVED"
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-rose-500/30 bg-rose-500/5"
                    }`}>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="size-4 text-muted-foreground" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mentor Feedback</p>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{submission.reviewComments}</p>
                </div>
            )}
        </div>
    )
}
