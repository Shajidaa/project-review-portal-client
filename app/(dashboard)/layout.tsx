import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ThemeProvider>
                {children}
                <Toaster position="top-right" richColors closeButton />
            </ThemeProvider>
        </AuthProvider>
    )
}
