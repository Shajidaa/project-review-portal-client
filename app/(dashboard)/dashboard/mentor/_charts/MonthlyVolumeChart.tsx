"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts"
import type { Submission } from "@/types/submission"

const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
}

export function MonthlyVolumeChart({ submissions }: { submissions: Submission[] }) {
    // seed last 6 months
    const monthlyMap: Record<string, { submitted: number; reviewed: number }> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" })
        monthlyMap[key] = { submitted: 0, reviewed: 0 }
    }

    submissions.forEach((s) => {
        const subKey = new Date(s.createdAt).toLocaleString("en-US", { month: "short", year: "2-digit" })
        if (subKey in monthlyMap) monthlyMap[subKey].submitted++

        if (s.reviewedAt) {
            const revKey = new Date(s.reviewedAt).toLocaleString("en-US", { month: "short", year: "2-digit" })
            if (revKey in monthlyMap) monthlyMap[revKey].reviewed++
        }
    })

    const data = Object.entries(monthlyMap).map(([month, counts]) => ({ month, ...counts }))

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div>
                <p className="text-sm font-semibold text-foreground">Monthly Volume</p>
                <p className="text-xs text-muted-foreground">Submissions received vs reviews completed (last 6 months)</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradReviewed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                        type="monotone"
                        dataKey="submitted"
                        name="Submitted"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#gradSubmitted)"
                        dot={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="reviewed"
                        name="Reviewed"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#gradReviewed)"
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
