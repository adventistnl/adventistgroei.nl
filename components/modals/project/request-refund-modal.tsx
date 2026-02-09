"use client"

import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DollarSign, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { REQUEST_SUBSIDY_REFUND } from "@/graphql/mutations/REFUND_MUTATIONS"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"
import { LanguagePreference } from "@/types/graphql-global-types"

export interface RequestRefundModalProps {
  isOpen: boolean
  onClose: () => void
  subsidyId: string
  currentAmount: number
  onSuccess?: () => void
}

export function RequestRefundModal({
  isOpen,
  onClose,
  subsidyId,
  currentAmount,
  onSuccess
}: RequestRefundModalProps) {
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [refundAmount, setRefundAmount] = useState<string>("")
  const [reason, setReason] = useState<string>("")

  const [requestRefund, { loading: isLoading }] = useMutation(REQUEST_SUBSIDY_REFUND, {
    // Force refetch to update the UI immediately
    refetchQueries: ['GetAllSubsidyRequests', 'GetSubsidyRequestById'],
    awaitRefetchQueries: true,
  })

  const t = subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund ||
    subsidyRequestTranslations.en.refund

  const handleSubmit = async () => {
    const amount = parseFloat(refundAmount)

    // Validations
    if (!refundAmount || amount <= 0) {
      toast.error(t.refundAmountRequired)
      return
    }

    if (!reason.trim()) {
      toast.error(t.refundReasonRequired)
      return
    }

    if (amount > currentAmount) {
      toast.error(`Refund amount cannot exceed ${formatCurrency(currentAmount)}`)
      return
    }

    try {
      await requestRefund({
        variables: {
          id: subsidyId,
          refundAmount: amount,
          reason: reason.trim(),
          language: i18n.language as LanguagePreference
        }
      })

      toast.success(t.refundRequestSuccess, { duration: 3000 })

      // Reset form
      setRefundAmount("")
      setReason("")

      if (onSuccess) {
        onSuccess()
      }

      onClose()
    } catch (error: any) {
      console.error('Error requesting refund:', error)

      // Apollo can return errors in different ways
      let graphQLError = error?.graphQLErrors?.[0]
      if (!graphQLError && error?.networkError?.result?.errors) {
        graphQLError = error.networkError.result.errors[0]
      }

      const errorMessage = graphQLError?.message || error?.message || "Error requesting refund"
      toast.error(errorMessage, { duration: 5000 })
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setRefundAmount("")
      setReason("")
      onClose()
    }
  }

  const isSubmitEnabled =
    refundAmount &&
    parseFloat(refundAmount) > 0 &&
    reason.trim().length > 0 &&
    !isLoading

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg mb-2">
            {t.refundModalTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.refundModalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info Alert */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Current subsidy amount: <strong>{formatCurrency(currentAmount)}</strong>
              </p>
            </div>
          </div>

          {/* Refund Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="refund-amount" className="text-sm font-medium">
              {t.refundAmountLabel}
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="refund-amount"
                type="number"
                step="0.01"
                min="0"
                max={currentAmount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="0.00"
                className="pl-9"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum: {formatCurrency(currentAmount)}
            </p>
          </div>

          {/* Reason Textarea */}
          <div className="space-y-2">
            <Label htmlFor="refund-reason" className="text-sm font-medium">
              {t.refundReason}
            </Label>
            <Textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t.refundReasonPlaceholder}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/500 characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            size="sm"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            size="sm"
            className="min-w-[140px]"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                {t.submit}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
