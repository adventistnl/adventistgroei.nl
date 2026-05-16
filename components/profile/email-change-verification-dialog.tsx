"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmailVerificationStep } from "@/components/registration/steps/email-verification-step"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2, Mail } from "lucide-react"
import { useTranslation } from "react-i18next"

interface EmailChangeVerificationDialogProps {
  open: boolean
  newEmail: string
  isVerified: boolean
  isLoading?: boolean
  /** True while the OTP code is being sent for the first time (modal just opened) */
  isSendingCode?: boolean
  /** Error that occurred during the initial OTP send */
  sendError?: string | null
  onVerify: (code: string) => Promise<boolean>
  onResend: () => Promise<boolean>
  onCancel: () => void
  onRetry?: () => void
}

export function EmailChangeVerificationDialog({
  open,
  newEmail,
  isVerified,
  isLoading,
  isSendingCode,
  sendError,
  onVerify,
  onResend,
  onCancel,
  onRetry,
}: EmailChangeVerificationDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel() }}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("profile.email_change.title", "Verify New Email")}</DialogTitle>
          <DialogDescription>
            {isSendingCode
              ? t("profile.email_change.sending", "Sending verification code to your new email...")
              : sendError
              ? t("profile.email_change.send_failed", "Could not send the verification code.")
              : t("profile.email_change.description", "A verification code has been sent to your new email address. Enter the code below to confirm the change.")}
          </DialogDescription>
        </DialogHeader>

        {/* Sending state: spinner */}
        {isSendingCode && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Mail className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("profile.email_change.sending_to", "Sending code to")} <strong>{newEmail}</strong></span>
            </div>
          </div>
        )}

        {/* Error state: send failed */}
        {!isSendingCode && sendError && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-start gap-3 rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm text-destructive">
                <p className="font-medium mb-1">{t("profile.email_change.send_failed", "Failed to send code")}</p>
                <p className="text-destructive/80">{sendError}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={onCancel}>
                {t("common.cancel", "Cancel")}
              </Button>
              {onRetry && (
                <Button size="sm" onClick={onRetry}>
                  {t("profile.email_change.retry", "Try Again")}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* OTP input state: code sent successfully */}
        {!isSendingCode && !sendError && (
          <EmailVerificationStep
            email={newEmail}
            translations={{
              title: t("profile.email_change.title", "Verify New Email"),
              description: t("profile.email_change.description", "Enter the 6-digit code sent to your new email."),
              codeSentTo: t("register.codeSentTo", "Code sent to"),
              enterCode: t("register.enterCode", "Enter code"),
              resendCode: t("register.resendCode", "Resend code"),
              resendIn: t("register.resendIn", "Resend in"),
              verifying: t("register.verifying", "Verifying..."),
              verified: t("register.verified", "Email verified!"),
              invalidCode: t("register.invalidCode", "Invalid code. Please try again."),
              sending: t("register.sending", "Sending..."),
              codeSent: t("register.codeSent", "Code sent!"),
            }}
            onVerify={onVerify}
            onResend={onResend}
            isVerified={isVerified}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
