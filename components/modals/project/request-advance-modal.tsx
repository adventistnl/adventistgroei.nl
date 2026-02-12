"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle, Banknote, ChevronDown } from "lucide-react"

interface RequestAdvanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (advanceAmount: number) => Promise<void>
  subsidizedBudget: number
  projectName?: string
}

export function RequestAdvanceModal({
  isOpen,
  onClose,
  onSubmit,
  subsidizedBudget,
  projectName,
}: RequestAdvanceModalProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [advanceAmount, setAdvanceAmount] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = React.useState(false)
    const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({
      projectInfo: false,
      importantNotice: false,
      awareness: false
    })

      const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Calculate maximum allowed advance (50% of subsidized budget)
  const maxAdvance = subsidizedBudget * 0.5

  const handleAmountChange = (value: string) => {
    setAdvanceAmount(value)
    setError(null)

    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > maxAdvance) {
      setError(t("subsidyRequest.advance.exceeds50Percent", "Amount exceeds 50% of subsidized budget"))
    }
  }

  const handleMaxClick = () => {
    setAdvanceAmount(maxAdvance.toFixed(2))
    setError(null)
  }

  const handleSubmit = async () => {
    const numValue = parseFloat(advanceAmount)
    
    if (isNaN(numValue) || numValue <= 0) {
      setError(t("subsidyRequest.validation.amountPositive", "Amount must be positive"))
      return
    }

    if (numValue > maxAdvance) {
      setError(t("subsidyRequest.advance.exceeds50Percent", "Amount exceeds 50% of subsidized budget"))
      return
    }

    if (!isConfirmed) {
      setError(t("subsidyRequest.advance.confirmationRequired", "Please confirm that you understand the terms"))
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(numValue)
      setAdvanceAmount("")
      setError(null)
      setIsConfirmed(false)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setAdvanceAmount("")
    setError(null)
    setIsConfirmed(false)
    onClose()
  }

    const renderCollapsibleSection = (
    sectionKey: string,
    icon: React.ReactNode,
    title: string,
    content: React.ReactNode
  ) => {
    const isCollapsed = collapsedSections[sectionKey]
    
    return (
      <div className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md p-2 -m-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : ''
            }`}
          />
        </button>
        
        {!isCollapsed && (
          <div className="animate-in fade-in-0 duration-200 slide-in-from-top-1">
            {content}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            {t("subsidyRequest.advance.title", "Request Advance Payment")}
          </DialogTitle>
          <DialogDescription>
            {t("subsidyRequest.advance.description", "Request an advance payment for this project")}
            {projectName && (
              <span className="block mt-1 font-medium text-foreground">
                {projectName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="advanceAmount">
              {t("subsidyRequest.advance.amount", "Advance Amount")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="advanceAmount"
                type="number"
                step="0.01"
                min="0"
                max={maxAdvance}
                value={advanceAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleMaxClick}
                disabled={isSubmitting}
                className="px-4"
              >
                {t("subsidyRequest.advance.maxButton", "MAX")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("subsidyRequest.advance.maxAllowed", `Maximum allowed: ${formatCurrency(maxAdvance)}`, { amount: formatCurrency(maxAdvance) })}
            </p>
          </div>

          {renderCollapsibleSection(
            'importantNotice',
            <AlertCircle className="w-4 h-4 text-gray-500" />,
            t("subsidyRequest.advance.importantNotice", "Important Notice"),
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                  {t("subsidyRequest.advance.confirmationText", 
                    "I understand that I am requesting 50% of the subsidized budget value before full subsidy processing. If the advance amount is not justified for project use, a refund of the unjustified amount may be requested.")}
              </p>
            </div>
          )}

          <div className="flex items-start space-x-3 rounded-lg border border-border bg-muted/50 p-4">
            <Checkbox
              id="confirmAdvance"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked === true)}
              disabled={isSubmitting}
              className="mt-0.5"
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="confirmAdvance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t("subsidyRequest.advance.confirmationLabel", "I understand the advance payment terms")}
              </Label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !advanceAmount || !isConfirmed}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("subsidyRequest.advance.submit", "Request Advance")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
