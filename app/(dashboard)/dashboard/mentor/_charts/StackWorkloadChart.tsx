"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts"
import type { Submission } from "@/types/submission"

const COLORS = {
    pending: "#f59e0b",
    approved: "#10b981",
    rejected: "#f43f5e",
}

const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
}

export function StackWorkloadChart({ submissions }: { submissions: Submission[] }) {
    // group by repoStack — count pending / approved / rejected
    const map: Record<string, { Pending: number; Approved: number; Rejected: number }> = {}

    submissions.forEach((s) => {
        if (!map[s.repoStack]) map[s.repoStack] = { Pending: 0, Approved: 0, Rejected: 0 }
        if (s.status === "PENDING") map[s.repoStack].Pending++
        if (s.status === "APPROVED") map[s.repoStack].Approved++
        if (s.status === "REJECTED") map[s.repoStack].Rejected++
    })

    const data = Object.entries(map).map(([stack, counts]) => ({ stack, ...counts }))

    if (data.length === 0) return null

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div>
                <p className="text-sm font-semibold text-foreground">Workload by Stack</p>
                <p className="text-xs text-muted-foreground">Pending · Approved · Rejected per tech stack</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} barSize={16} barGap={3}>
                    <XAxis dataKey="stack" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>}
                    />
                    <Bar dataKey="Pending" fill={COLORS.pending} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Approved" fill={COLORS.approved} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Rejected" fill={COLORS.rejected} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
