"use client"

import * as React from "react"
import { Mail, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmailVerificationStepProps {
  email: string
  translations: {
    title: string
    description: string
    codeSentTo: string
    enterCode: string
    resendCode: string
    resendIn: string
    verifying: string
    verified: string
    invalidCode: string
    sending: string
    codeSent: string
  }
  onVerify: (code: string) => Promise<boolean>
  onResend: () => Promise<boolean>
  isVerified: boolean
  isLoading?: boolean
}

/**
 * Step: Email Verification
 * Displays a 6-digit OTP input. The user enters the code received by email.
 * Auto-submits once all 6 digits are filled.
 */
export function EmailVerificationStep({
  email,
  translations,
  onVerify,
  onResend,
  isVerified,
  isLoading = false,
}: EmailVerificationStepProps) {
  const [digits, setDigits] = React.useState<string[]>(Array(6).fill(""))
  const [status, setStatus] = React.useState<"idle" | "verifying" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [resendCountdown, setResendCountdown] = React.useState(60)
  const [isSending, setIsSending] = React.useState(false)
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend button
  React.useEffect(() => {
    if (resendCountdown <= 0) return
    const interval = setInterval(() => {
      setResendCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendCountdown])

  // Auto-verify when all 6 digits are entered
  React.useEffect(() => {
    const code = digits.join("")
    if (code.length === 6 && !digits.includes("") && status === "idle") {
      handleVerify(code)
    }
  }, [digits])

  // If parent already confirmed verification, show success state
  React.useEffect(() => {
    if (isVerified) setStatus("success")
  }, [isVerified])

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)

    if (status === "error") {
      setStatus("idle")
      setErrorMessage("")
    }

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits]
        newDigits[index] = ""
        setDigits(newDigits)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const newDigits = Array(6).fill("")
    pasted.split("").forEach((char, i) => { newDigits[i] = char })
    setDigits(newDigits)
    const nextEmpty = newDigits.findIndex((d) => !d)
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerify = async (code: string) => {
    setStatus("verifying")
    setErrorMessage("")
    try {
      const success = await onVerify(code)
      if (success) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMessage(translations.invalidCode)
        setDigits(Array(6).fill(""))
        inputRefs.current[0]?.focus()
      }
    } catch {
      setStatus("error")
      setErrorMessage(translations.invalidCode)
      setDigits(Array(6).fill(""))
      inputRefs.current[0]?.focus()
    }
  }

  const handleResend = async () => {
    if (resendCountdown > 0 || isSending) return
    setIsSending(true)
    setStatus("idle")
    setErrorMessage("")
    setDigits(Array(6).fill(""))
    try {
      const sent = await onResend()
      if (sent) {
        setResendCountdown(60)
        inputRefs.current[0]?.focus()
      } else {
        setStatus("error")
        setErrorMessage("Could not send a new code. Please wait and try again.")
      }
    } finally {
      setIsSending(false)
    }
  }

  const isVerifying = status === "verifying" || isLoading
  const isSuccess = status === "success"
  const isError = status === "error"

  return (
    <div className="flex flex-col items-center gap-6 py-2">

      {/* Icon + email info */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300",
          isSuccess ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {isSuccess
            ? <CheckCircle2 className="w-7 h-7" />
            : <Mail className="w-7 h-7" />
          }
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{translations.codeSentTo}</p>
          <p className="font-medium text-sm mt-0.5 text-foreground">{email}</p>
        </div>
      </div>

      {/* Success state */}
      {isSuccess ? (
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>{translations.verified}</span>
        </div>
      ) : (
        <>
          {/* OTP digit inputs */}
          <div className="flex gap-2.5" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={isVerifying}
                className={cn(
                  // Base layout
                  "w-11 h-14 text-center text-xl font-bold font-mono",
                  // Border & radius — match app's input style
                  "rounded-lg border-2 outline-none transition-all duration-150",
                  // Background
                  "bg-background",
                  // Default idle state
                  !digit && !isError && "border-border",
                  // Filled digit
                  digit && !isError && "border-foreground/30 bg-muted",
                  // Error state
                  isError && "border-destructive/60 bg-destructive/5",
                  // Disabled
                  isVerifying && "opacity-50 cursor-not-allowed",
                  // Focus ring uses the app's ring variable
                  "focus:border-foreground focus:shadow-[0_0_0_3px_rgba(42,42,42,0.12)]",
                )}
                style={{
                  // Scale up filled cells slightly for a satisfying feel
                  transform: digit ? "scale(1.03)" : "scale(1)",
                  color: "var(--foreground)",
                }}
              />
            ))}
          </div>

          {/* Status feedback */}
          {isVerifying && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{translations.verifying}</span>
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-1.5 text-sm text-destructive-foreground bg-destructive/10 px-3 py-1.5 rounded-md">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Resend section */}
          <div className="flex flex-col items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={resendCountdown > 0 || isSending || isVerifying}
              onClick={handleResend}
              className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {isSending
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <RefreshCw className="w-3.5 h-3.5" />
              }
              {isSending ? translations.sending : translations.resendCode}
            </Button>

            {resendCountdown > 0 && (
              <p className="text-xs text-muted-foreground tabular-nums">
                {translations.resendIn} {resendCountdown}s
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
