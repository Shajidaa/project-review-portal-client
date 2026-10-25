import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
