"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { SubmissionStats } from "@/types/submission"

const STATUS_COLORS: Record<string, string> = {
    Pending: "#f59e0b",
    Approved: "#10b981",
    Rejected: "#f43f5e",
}

const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
}

export function StatusPieChart({ stats }: { stats: SubmissionStats }) {
    const data = [
        { name: "Pending", value: stats.pending },
        { name: "Approved", value: stats.approved },
        { name: "Rejected", value: stats.rejected },
    ].filter((d) => d.value > 0)

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div>
                <p className="text-sm font-semibold text-foreground">Platform Status</p>
                <p className="text-xs text-muted-foreground">Overall submission review distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={78}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
