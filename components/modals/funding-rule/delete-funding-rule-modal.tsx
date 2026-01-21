"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"

interface FundingRule {
  id: string
  name: string
  type: 'percentage' | 'amount' | 'number' | 'category' | 'boolean'
  condition: string
  value: any
  description: string
  ruleCategory: 'justification' | 'condition'
}

interface DeleteFundingRuleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  rule: FundingRule | null
  groupName?: string
}

export function DeleteFundingRuleModal({
  isOpen,
  onOpenChange,
  onConfirm,
  rule,
  groupName = "Group"
}: DeleteFundingRuleModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  const handleSubmit = async () => {
    if (!rule) return
    
    setIsLoading(true)
    const loadingToast = toast.loading(t('funding_rules.delete_modal.toasts.deleting'))
    
    try {
      await onConfirm()
      toast.dismiss(loadingToast)
      toast.success(t('funding_rules.delete_modal.toasts.deleted'), {
        duration: 3000,
        icon: '🗑️'
      })
      onOpenChange(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('funding_rules.delete_modal.toasts.delete_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
      onOpenChange(false)
    }
  }

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === 'delete rule' && !isLoading

  if (!rule) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg mb-2">
            {t('funding_rules.delete_modal.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('funding_rules.delete_modal.description')}
          </DialogDescription>
        </DialogHeader>
        
        {/* Conteúdo - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            
            {/* Rule Information */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('funding_rules.delete_modal.confirm_message', { groupName })}
              </p>

              <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
                <p className="font-medium text-sm">{rule.name}</p>
                {rule.description && (
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{t('funding_rules.delete_modal.rule_preview.condition')}:</span>
                  <code className="text-xs bg-background px-2 py-0.5 rounded border">{rule.condition}</code>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-destructive font-medium mb-1">
                    {t('funding_rules.delete_modal.warning.title')}
                  </p>
                  <p className="text-xs text-destructive/80">
                    {t('funding_rules.delete_modal.warning.message')}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-950">
                <Checkbox
                  id="understand-consequences"
                  checked={understoodConsequences}
                  onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                  className="mt-0.5 border-2 border-gray-400 dark:border-gray-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <label htmlFor="understand-consequences" className="text-sm cursor-pointer">
                  <span className="font-medium text-foreground">
                    {t('funding_rules.delete_modal.understand_consequences')}
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    {t('funding_rules.delete_modal.acknowledge_text')}
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('funding_rules.delete_modal.type_confirmation')}
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder={t('funding_rules.delete_modal.confirmation_placeholder')}
                    className="h-10"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('funding_rules.delete_modal.confirmation_help')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação - Fixos no rodapé */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} size="sm" className="text-xs">
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isDeleteEnabled}
              size="sm"
              className={`min-w-[140px] text-xs ${
                isDeleteEnabled 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-600/40 text-white/60 cursor-not-allowed hover:bg-red-600/40'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  {t('funding_rules.delete_modal.buttons.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
                  {t('funding_rules.delete_modal.buttons.delete')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
