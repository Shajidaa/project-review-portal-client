"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react"
import { authApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCardWrapper } from "./AuthCardWrapper"
import { PasswordCriteria } from "./PasswordCriteria"

export function ForgotPasswordForm() {
  const router = useRouter()

  const [step, setStep] = React.useState<"request" | "reset">("request")
  const [email, setEmail] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address")
      return
    }

    setIsLoading(true)

    try {
      await authApi.forgotPassword({ email: email.trim() })
      setSuccessMessage("If that email exists, a password reset code has been sent.")
      setStep("reset")
    } catch (err: unknown) {
      const error = err as Error
      setErrorMessage(error.message || "Failed to process request.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (otp.trim().length !== 6) {
      setErrorMessage("Please enter the 6-digit reset code")
      return
    }

    if (!isPasswordValid) {
      setErrorMessage(
        "Password must be at least 8 characters with at least one uppercase letter and one number"
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await authApi.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      })

      setSuccessMessage("Password reset successfully! Redirecting to sign in...")

      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMessage(error.message || "Failed to reset password. Please verify your OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCardWrapper
      title={step === "request" ? "Reset Password" : "Set New Password"}
      description={
        step === "request"
          ? "Enter your email to receive a password reset verification code"
          : `Enter the 6-digit code sent to ${email} and create your new password`
      }
      footerText="Remembered your password?"
      footerLinkText="Sign in"
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

      {step === "request" ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Registered Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 font-semibold gap-2 shadow-sm cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Sending reset code...</span>
              </>
            ) : (
              <>
                <span>Send Reset Code</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="otp">6-Digit Reset Code</Label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="pl-10 font-mono tracking-widest text-center"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <PasswordCriteria password={newPassword} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 font-semibold gap-2 shadow-sm cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Resetting password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setStep("request")
                setErrorMessage(null)
              }}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              &larr; Request code again
            </button>
          </div>
        </form>
      )}
    </AuthCardWrapper>
  )
}
