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
import { Loader2, AlertCircle, Banknote } from "lucide-react"

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

  // Calculate maximum allowed advance (50% of subsidized budget)
  const maxAdvance = subsidizedBudget * 0.5

  const handleAmountChange = (value: string) => {
    setAdvanceAmount(value)
    setError(null)

    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > maxAdvance) {
      setError(t("subsidyRequest.advance.exceeds50Percent"))
    }
  }

  const handleSubmit = async () => {
    const numValue = parseFloat(advanceAmount)
    
    if (isNaN(numValue) || numValue <= 0) {
      setError(t("subsidyRequest.validation.amountPositive"))
      return
    }

    if (numValue > maxAdvance) {
      setError(t("subsidyRequest.advance.exceeds50Percent"))
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(numValue)
      setAdvanceAmount("")
      setError(null)
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
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            {t("subsidyRequest.advance.title")}
          </DialogTitle>
          <DialogDescription>
            {t("subsidyRequest.advance.description")}
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
              {t("subsidyRequest.advance.amount")}
            </Label>
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
            />
            <p className="text-sm text-muted-foreground">
              {t("subsidyRequest.advance.maxAllowed", { amount: formatCurrency(maxAdvance) })}
            </p>
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
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !advanceAmount}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("subsidyRequest.advance.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
