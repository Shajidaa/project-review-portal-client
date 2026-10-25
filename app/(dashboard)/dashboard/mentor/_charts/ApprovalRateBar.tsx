"use client"

import type { SubmissionStats } from "@/types/submission"

export function ApprovalRateBar({ stats }: { stats: SubmissionStats }) {
    const rejectedPct = stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0
    const approvedPct = stats.approvalRate
    const pendingPct = 100 - rejectedPct - approvedPct

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-foreground">Platform Approval Rate</p>
                    <p className="text-xs text-muted-foreground">
                        {stats.approved} approved · {stats.rejected} rejected · {stats.pending} awaiting review
                    </p>
                </div>
                <span className={`text-2xl font-bold ${approvedPct >= 60 ? "text-emerald-500" : approvedPct >= 30 ? "text-amber-500" : "text-rose-500"
                    }`}>
                    {approvedPct}%
                </span>
            </div>

            {/* Stacked progress bar */}
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <div
                    className="absolute left-0 top-0 h-full bg-rose-500 transition-all duration-700"
                    style={{ width: `${rejectedPct}%` }}
                />
                <div
                    className="absolute top-0 h-full bg-emerald-500 transition-all duration-700"
                    style={{ left: `${rejectedPct}%`, width: `${approvedPct}%` }}
                />
                <div
                    className="absolute top-0 h-full bg-amber-400/70 transition-all duration-700"
                    style={{ left: `${rejectedPct + approvedPct}%`, width: `${pendingPct}%` }}
                />
            </div>

            {/* By project type mini-bars */}
            {stats.byProjectType.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-1">
                    {stats.byProjectType.map(({ type, count }) => {
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                        return (
                            <div key={type} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-foreground">{type}</span>
                                    <span className="text-muted-foreground">{count} ({pct}%)</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-primary/70 transition-all duration-700"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500 inline-block" /> Approved ({stats.approved})</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-500 inline-block" /> Rejected ({stats.rejected})</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400 inline-block" /> Pending ({stats.pending})</span>
            </div>
        </div>
    )
}
