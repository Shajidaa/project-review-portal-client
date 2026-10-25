import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordCriteriaProps {
  password: string
}

export function PasswordCriteria({ password }: PasswordCriteriaProps) {
  if (!password) return null

  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return (
    <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
      <span
        className={cn(
          "inline-flex items-center gap-1 transition-colors",
          hasMinLength
            ? "text-emerald-600 dark:text-emerald-400 font-medium"
            : "text-muted-foreground"
        )}
      >
        {hasMinLength ? <Check className="size-3" /> : <X className="size-3 opacity-50" />}
        8+ chars
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1 transition-colors",
          hasUppercase
            ? "text-emerald-600 dark:text-emerald-400 font-medium"
            : "text-muted-foreground"
        )}
      >
        {hasUppercase ? <Check className="size-3" /> : <X className="size-3 opacity-50" />}
        1 Uppercase
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1 transition-colors",
          hasNumber
            ? "text-emerald-600 dark:text-emerald-400 font-medium"
            : "text-muted-foreground"
        )}
      >
        {hasNumber ? <Check className="size-3" /> : <X className="size-3 opacity-50" />}
        1 Number
      </span>
    </div>
  )
}
