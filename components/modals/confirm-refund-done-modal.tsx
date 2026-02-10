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
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '@/contexts/currency-context'

interface ConfirmRefundDoneModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  refundAmount: number
  isLoading?: boolean
}

export const ConfirmRefundDoneModal: React.FC<ConfirmRefundDoneModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  refundAmount,
  isLoading = false
}) => {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {t('subsidyRequest.refund.confirmRefundDone')}
              </DialogTitle>
              <DialogDescription>
                {t('subsidyRequest.refund.confirmRefundDoneAction')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Refund Amount Display */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-900 dark:text-green-100">
                {t('subsidyRequest.refund.refundAmount')}
              </span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(refundAmount)}
              </span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-900 dark:text-amber-100">
              {t('subsidyRequest.refund.confirmRefundWarning')}
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('subsidyRequest.refund.cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          >
            {isLoading ? t('common.processing') : t('subsidyRequest.refund.confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
