"use client"

import * as React from "react"
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
  User,
} from "lucide-react"
import { authApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCardWrapper } from "./AuthCardWrapper"
import { OtpVerificationForm } from "./OtpVerificationForm"
import { PasswordCriteria } from "./PasswordCriteria"

export function RegisterForm() {
  const router = useRouter()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  // OTP Step
  const [isOtpStep, setIsOtpStep] = React.useState(false)

  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (name.trim().length < 2) {
      setErrorMessage("Full name must be at least 2 characters")
      return
    }

    if (!isPasswordValid) {
      setErrorMessage(
        "Password must be at least 8 characters and contain at least one uppercase letter and one number"
      )
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      setSuccessMessage(
        response.message ||
        "Registration successful! Please check your email for the 6-digit activation code."
      )
      setIsOtpStep(true)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMessage(error.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isOtpStep) {
    return (
      <AuthCardWrapper
        title="Verify Your Account"
        description={`Enter the 6-digit code sent to ${email}`}
        footerText="Already verified?"
        footerLinkText="Sign in"
        footerLinkHref="/login"
      >
        <OtpVerificationForm
          email={email.trim()}
          actionText="Complete Registration"
          onSuccess={() => {
            setTimeout(() => {
              router.push("/dashboard")
              router.refresh()
            }, 1000)
          }}
          onBack={() => {
            setIsOtpStep(false)
            setErrorMessage(null)
          }}
        />
      </AuthCardWrapper>
    )
  }

  return (
    <AuthCardWrapper
      title="Create an account"
      description="Join the project review portal to submit projects and receive mentor feedback"
      footerText="Already have an account?"
      footerLinkText="Sign in instead"
      footerLinkHref="/login"
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

      <form onSubmit={handleRegister} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Email Address */}
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

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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

          <PasswordCriteria password={password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-[11px] text-destructive pt-0.5">Passwords do not match</p>
          )}
        </div>

        {/* Register Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 font-semibold gap-2 shadow-sm shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </AuthCardWrapper>
  )
}
