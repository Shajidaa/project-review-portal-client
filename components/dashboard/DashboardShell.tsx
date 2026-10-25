import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardNavbar } from "./DashboardNavbar"

export function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardNavbar />
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
