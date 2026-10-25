"use client"

import * as React from "react"
import { AlertCircle, ArrowRight, CheckCircle2, KeyRound, Loader2, RotateCw } from "lucide-react"
import { authApi, setAccessToken } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OtpVerificationFormProps {
  email: string
  onSuccess: (accessToken?: string) => void
  onBack?: () => void
  initialCooldown?: number
  actionText?: string
}

export function OtpVerificationForm({
  email,
  onSuccess,
  onBack,
  initialCooldown = 60,
  actionText = "Verify & Continue",
}: OtpVerificationFormProps) {
  const [otp, setOtp] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isResending, setIsResending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = React.useState(initialCooldown)

  // Countdown timer for resend
  React.useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (otp.trim().length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code")
      return
    }

    setIsLoading(true)

    try {
      const res = await authApi.verifyEmail({ email, otp: otp.trim() })

      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken)
      }

      setSuccessMessage("Code verified successfully! Redirecting...")
      onSuccess(res.data?.accessToken)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMessage(error.message || "Invalid or expired verification code.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return
    setIsResending(true)
    setErrorMessage(null)

    try {
      await authApi.resendOtp({ email })
      setSuccessMessage("A fresh verification code has been sent to your email.")
      setResendCooldown(60)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMessage(error.message || "Failed to resend code.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="otp" className="text-xs font-medium">
          6-Digit Verification Code
        </Label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="pl-10 text-center tracking-[0.5em] font-mono text-base font-semibold"
            autoFocus
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className="w-full h-10 font-semibold gap-2 shadow-sm cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Verifying code...</span>
          </>
        ) : (
          <>
            <span>{actionText}</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-between pt-2 text-xs">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            &larr; Back
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || isResending}
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
        >
          <RotateCw className={`size-3 ${isResending ? "animate-spin" : ""}`} />
          <span>
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
          </span>
        </button>
      </div>
    </form>
  )
}
