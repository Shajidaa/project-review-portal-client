"use client"

import * as React from "react"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submissionApi } from "@/lib/submission-api"
import type { Submission } from "@/types/submission"

interface ReviewModalProps {
    submission: Submission
    onClose: () => void
    onReviewed: (updated: Submission) => void
}

export function ReviewModal({ submission, onClose, onReviewed }: ReviewModalProps) {
    const [verdict, setVerdict] = React.useState<"APPROVED" | "REJECTED" | null>(null)
    const [comments, setComments] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!verdict) return
        setError(null)
        setLoading(true)
        try {
            const res = await submissionApi.review(submission.id, {
                reviewStatus: verdict,
                reviewComments: comments.trim() || undefined,
            })
            onReviewed(res.data)
        } catch (err: unknown) {
            setError((err as Error).message ?? "Failed to submit review")
        } finally {
            setLoading(false)
        }
    }

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">Review: {submission.projectName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">by {submission.student.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-lg leading-none"
                    >×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Verdict */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Verdict <span className="text-destructive">*</span></p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setVerdict("APPROVED")}
                                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all cursor-pointer ${verdict === "APPROVED"
                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "border-border text-muted-foreground hover:border-emerald-500/50 hover:text-emerald-500"
                                    }`}
                            >
                                <CheckCircle2 className="size-4" /> Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => setVerdict("REJECTED")}
                                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all cursor-pointer ${verdict === "REJECTED"
                                        ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                        : "border-border text-muted-foreground hover:border-rose-500/50 hover:text-rose-500"
                                    }`}
                            >
                                <XCircle className="size-4" /> Reject
                            </button>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Feedback <span className="font-normal">(optional)</span>
                        </label>
                        <textarea
                            rows={4}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            maxLength={1000}
                            placeholder="Leave constructive feedback for the student…"
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                        <p className="text-xs text-muted-foreground text-right">{comments.length} / 1000</p>
                    </div>

                    {error && (
                        <p className="text-xs text-destructive">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!verdict || loading}
                            className={`gap-2 cursor-pointer ${verdict === "REJECTED"
                                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                }`}
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : verdict === "REJECTED" ? <XCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
                            {loading ? "Submitting…" : verdict === "REJECTED" ? "Reject" : "Approve"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
