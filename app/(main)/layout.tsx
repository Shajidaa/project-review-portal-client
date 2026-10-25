import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1 w-full">{children}</main>
                </div>
            </AuthProvider>
        </ThemeProvider>
    )
}
