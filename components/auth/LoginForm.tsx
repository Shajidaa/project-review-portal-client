"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react"
import { authApi, setAccessToken } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCardWrapper } from "./AuthCardWrapper"
import { OtpVerificationForm } from "./OtpVerificationForm"

export function LoginForm() {
  const router = useRouter()
  const { refreshUser } = useAuth()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  // Unverified email handling
  const [requiresOtp, setRequiresOtp] = React.useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.login({ email, password })

      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken)
        await refreshUser()
      }

      setSuccessMessage("Signed in successfully! Redirecting...")

      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1000)
    } catch (err: unknown) {
      const error = err as Error & { statusCode?: number }

      if (
        error.statusCode === 403 ||
        error.message?.toLowerCase().includes("not verified")
      ) {
        setRequiresOtp(true)
        setErrorMessage(
          "Your email is not verified yet. A verification code has been dispatched to your inbox."
        )
      } else {
        setErrorMessage(error.message || "Failed to sign in. Please verify credentials.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (requiresOtp) {
    return (
      <AuthCardWrapper
        title="Verify Email"
        description={`Enter the 6-digit code sent to ${email}`}
        footerText="Remembered password?"
        footerLinkText="Sign in"
        footerLinkHref="/login"
      >
        <OtpVerificationForm
          email={email}
          onSuccess={() => {
            setTimeout(() => {
              router.push("/")
              router.refresh()
            }, 1000)
          }}
          onBack={() => {
            setRequiresOtp(false)
            setErrorMessage(null)
          }}
        />
      </AuthCardWrapper>
    )
  }

  return (
    <AuthCardWrapper
      title="Welcome back"
      description="Sign in to access your project reviews, feedback, and dashboard"
      footerText="Don't have an account yet?"
      footerLinkText="Create an account"
      footerLinkHref="/register"
      footerIcon={<Sparkles className="size-3" />}
    >
      {/* Feedback Alerts */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span className="leading-tight">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          <span className="leading-tight">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 font-semibold gap-2 shadow-sm shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </AuthCardWrapper>
  )
}
