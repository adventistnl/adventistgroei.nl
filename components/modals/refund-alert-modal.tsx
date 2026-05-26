"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '@/contexts/currency-context'

interface RefundSubsidy {
  id: string
  description: string
  total_budget: number
  approved_amount: number
  refund_amount: number
  project: {
    id: string
    title: string
  }
  institution: {
    id: string
    name: string
  }
  department: {
    id: string
    name: string
  }
}

interface RefundAlertModalProps {
  isOpen: boolean
  onClose: () => void
  refunds: RefundSubsidy[]
  onDontRemindToday: (checked: boolean) => void
}

export const RefundAlertModal: React.FC<RefundAlertModalProps> = ({
  isOpen,
  onClose,
  refunds,
  onDontRemindToday
}) => {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [dontRemindChecked, setDontRemindChecked] = React.useState(false)

  const handleClose = () => {
    if (dontRemindChecked) {
      onDontRemindToday(true)
    }
    onClose()
  }

  const totalRequestedAmount = refunds.reduce((sum, refund) => sum + Number(refund.approved_amount ?? refund.total_budget ?? 0), 0)
  const totalRefundAmount = refunds.reduce((sum, refund) => sum + Number(refund.refund_amount ?? 0), 0)

  if (process.env.NODE_ENV === 'development') {
    console.log('[RefundAlertModal] refunds raw:', refunds)
    console.log('[RefundAlertModal] totalRequestedAmount:', totalRequestedAmount, '| totalRefundAmount:', totalRefundAmount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {t('refund.alert.modalTitle')}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            {refunds.length === 1
              ? t('refund.alert.singlePending')
              : t('refund.alert.multiplePending', { count: refunds.length })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* KPIs - Minimalista e Monocromático */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('refund.alert.totalRequested') || 'Total Solicitado'}
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalRequestedAmount)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('refund.alert.totalRefund') || 'Total Reembolso'}
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalRefundAmount)}
              </p>
            </div>
          </div>

          {/* Refund List - Minimalista */}
          <div className="max-h-[280px] space-y-2 overflow-y-auto">
            {refunds.map((refund) => (
              <div
                key={refund.id}
                className="rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                      {refund.project?.title || refund.description || t('refund.alert.untitledSubsidy')}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {refund.department.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('refund.alert.refundLabel') || 'Reembolso'}
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {formatCurrency(Number(refund.refund_amount))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Don't remind checkbox */}
          <div className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-800 rounded-md">
            <Checkbox
              id="dont-remind"
              checked={dontRemindChecked}
              onCheckedChange={(checked) => setDontRemindChecked(checked as boolean)}
            />
            <Label
              htmlFor="dont-remind"
              className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer"
            >
              {t('refund.alert.dontRemindToday')}
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} variant="outline" className="w-full sm:w-auto border-gray-300 dark:border-gray-700">
            {t('refund.alert.understood')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
