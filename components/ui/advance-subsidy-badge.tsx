import React from 'react'
import { Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SubsidyStatusBadge } from './subsidy-status-badge'

interface AdvanceSubsidyBadgeProps {
  isForAdvance?: boolean
  className?: string
}

export function AdvanceSubsidyBadge({ isForAdvance, className }: AdvanceSubsidyBadgeProps) {
  const { t } = useTranslation()

  if (!isForAdvance) return null

  return (
    <SubsidyStatusBadge
      icon={Zap}
      text={t('subsidy.advance')}
      variant="custom"
      customColors={{
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-400",
        darkBg: "dark:bg-amber-950/30",
        darkText: "dark:text-amber-400",
        darkBorder: "dark:border-amber-600"
      }}
      className={className}
    />
  )
}
