import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AdvanceSubsidyBadgeProps {
  isForAdvance?: boolean
  className?: string
}

export function AdvanceSubsidyBadge({ isForAdvance, className }: AdvanceSubsidyBadgeProps) {
  const { t } = useTranslation()
  
  if (!isForAdvance) return null

  return (
    <Badge 
      variant="outline" 
      className={`bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 ${className || ''}`}
    >
      <Zap className="w-3 h-3 mr-1 fill-amber-500" />
      {t('subsidy.advance')}
    </Badge>
  )
}
