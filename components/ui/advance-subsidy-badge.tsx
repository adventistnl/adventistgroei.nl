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
      variant="advance"
      className={className}
    />
  )
}
