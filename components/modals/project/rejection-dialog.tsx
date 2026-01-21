"use client"

import * as React from "react"
import { AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RejectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
  title?: string
  description?: string
  warningMessage?: string
  confirmationText?: string
  isLoading?: boolean
}

interface RejectionDialogState {
  reason: string
  confirmed: boolean
}

export function RejectionDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  warningMessage,
  confirmationText,
  isLoading = false
}: RejectionDialogProps) {
  const { t } = useTranslation()
  const [state, setState] = React.useState<RejectionDialogState>({
    reason: "",
    confirmed: false
  })

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setState({ reason: "", confirmed: false })
    }
  }, [isOpen])

  const handleClose = React.useCallback(() => {
    setState({ reason: "", confirmed: false })
    onClose()
  }, [onClose])

  const handleConfirm = React.useCallback(async () => {
    if (!state.reason?.trim() || !state.confirmed) {
      return
    }

    try {
      await onConfirm(state.reason)
      handleClose()
    } catch (error) {
      // Error handling is done by parent component
      console.error('Error in rejection dialog:', error)
    }
  }, [state.reason, state.confirmed, onConfirm, handleClose])

  const handleReasonChange = React.useCallback((value: string) => {
    setState(prev => ({ ...prev, reason: value }))
  }, [])

  const handleConfirmedChange = React.useCallback((confirmed: boolean) => {
    setState(prev => ({ ...prev, confirmed }))
  }, [])

  // Default translations
  const dialogTitle = title || t('rejection.dialog.title', 'Rejeitar Solicitação')
  const dialogDescription = description || t('rejection.dialog.description', 'Por favor, forneça um motivo para a rejeição.')
  const dialogWarning = warningMessage || t('rejection.dialog.warning', 'Esta ação resultará na rejeição permanente da solicitação e não poderá ser desfeita.')
  const dialogConfirmation = confirmationText || t('rejection.dialog.confirmation', 'Confirmo que desejo rejeitar esta solicitação e entendo que esta ação não pode ser desfeita.')

  const isButtonDisabled = !state.reason?.trim() || !state.confirmed || isLoading

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rejection-reason" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('rejection.form.reasonLabel', 'Motivo da rejeição')} *
            </Label>
            <Textarea
              id="rejection-reason"
              value={state.reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              placeholder={t('rejection.form.reasonPlaceholder', 'Descreva o motivo da rejeição...')}
              className="resize-none border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          {/* Warning below input */}
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-r-md">
            <p className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {dialogWarning}
            </p>
          </div>
          
          {/* Confirmation checkbox */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              id="confirm-rejection"
              checked={state.confirmed}
              onChange={(e) => handleConfirmedChange(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 mt-0.5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-400 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
            />
            <label 
              htmlFor="confirm-rejection" 
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer"
            >
              {dialogConfirmation}
            </label>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isButtonDisabled}
            className="w-full sm:w-auto order-1 sm:order-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('rejection.actions.processing', 'Processando...')}
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                {t('rejection.actions.confirm', 'Rejeitar')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}