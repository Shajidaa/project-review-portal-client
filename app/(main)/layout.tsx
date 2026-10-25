import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import LoginPage from "./login/page"

export default function MainGroupLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <LoginPage/>
                </div>
            </AuthProvider>
        </ThemeProvider>
    )
}
