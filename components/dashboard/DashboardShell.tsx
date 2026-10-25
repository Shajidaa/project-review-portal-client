"use client"

import * as React from "react"
import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardNavbar } from "./DashboardNavbar"

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = React.useState(false)

    return (
        <div className="flex h-screen overflow-hidden">
            {/* ── Mobile backdrop ── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardNavbar onMenuClick={() => setMobileOpen((o) => !o)} />
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
