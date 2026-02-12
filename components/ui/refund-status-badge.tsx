"use client"

import React from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SubsidyStatusBadge } from "./subsidy-status-badge"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"

interface RefundStatusBadgeProps {
  haveRefund?: boolean
  refundDone?: boolean
  className?: string
}

/**
 * Badge component to display refund status
 * Shows "Waiting Refund" badge when refund is pending
 * Shows "Refund Done" badge when refund is completed
 */
export function RefundStatusBadge({ haveRefund, refundDone, className }: RefundStatusBadgeProps) {
  const { i18n } = useTranslation()

  // Don't show anything if no refund
  if (!haveRefund) return null

  // Refund completed
  if (refundDone) {
    return (
      <SubsidyStatusBadge
        icon={CheckCircle2}
        text={subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.refundDone || "Refund Done"}
        variant="refund-done"
        className={className}
      />
    )
  }

  // Refund pending
  return (
    <SubsidyStatusBadge
      icon={AlertCircle}
      text={subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.waitingRefund || "Waiting Refund"}
      variant="refund-pending"
      className={className}
    />
  )
}
