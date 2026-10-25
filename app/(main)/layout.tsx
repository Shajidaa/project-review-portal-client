import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Toaster } from "sonner"

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    {children}
                </div>
                <Toaster position="top-right" richColors closeButton />
            </AuthProvider>
        </ThemeProvider>
    )
}
