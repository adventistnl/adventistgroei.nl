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
import { DollarSign, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '@/contexts/currency-context'
import { Badge } from '@/components/ui/badge'

interface RefundSubsidy {
  id: string
  description: string
  refund_amount: number
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

  const totalRefundAmount = refunds.reduce((sum, refund) => sum + Number(refund.refund_amount), 0)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
              <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {t('refund.alert.modalTitle')}
              </DialogTitle>
              <DialogDescription>
                {refunds.length === 1
                  ? t('refund.alert.singlePending')
                  : t('refund.alert.multiplePending', { count: refunds.length })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                {t('refund.alert.totalPending')}
              </span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(totalRefundAmount)}
              </span>
            </div>
          </div>

          {/* Refund List */}
          <div className="max-h-[300px] space-y-2 overflow-y-auto">
            {refunds.map((refund) => (
              <div
                key={refund.id}
                className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {refund.description || t('refund.alert.untitledSubsidy')}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {refund.institution.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {refund.department.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                    <span className="font-semibold text-sm whitespace-nowrap">
                      {formatCurrency(Number(refund.refund_amount))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Don't remind checkbox */}
          <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            <Checkbox
              id="dont-remind"
              checked={dontRemindChecked}
              onCheckedChange={(checked) => setDontRemindChecked(checked as boolean)}
            />
            <Label
              htmlFor="dont-remind"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t('refund.alert.dontRemindToday')}
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full sm:w-auto">
            {t('refund.alert.understood')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
