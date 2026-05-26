"use client"

import * as React from "react"
import { AlertTriangle, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { projectTranslations } from "@/lib/translations/projects"

export interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  severity?: "low" | "medium" | "high"
  titleIcon?: React.ComponentType<{ className?: string }>
  actionIcon?: React.ComponentType<{ className?: string }>
  itemSummary?: {
    title: string
    subtitle?: string
    badge?: string
  }
  warnings?: Array<{
    icon: React.ComponentType<{ className?: string }>
    text: string
    badge?: string
  }>
  effects?: Array<{
    icon: React.ComponentType<{ className?: string }>
    text: string
  }>
  additionalWarning?: {
    title: string
    items: string[]
    recommendation?: string
  }
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  severity = "medium",
  titleIcon: TitleIcon,
  itemSummary,
  warnings = [],
  effects = [],
  additionalWarning,
}: ConfirmationDialogProps) {
  const { i18n } = useTranslation()
  const [isConfirmed, setIsConfirmed] = React.useState(false)

  const t =
    projectTranslations[i18n.language as keyof typeof projectTranslations] ||
    projectTranslations.en

  const finalConfirmText = confirmText || t.common.confirm || "Confirm"
  const finalCancelText = cancelText || t.common.cancel || "Cancel"

  React.useEffect(() => {
    if (isOpen) setIsConfirmed(false)
  }, [isOpen])

  const handleConfirm = () => {
    if (!isConfirmed) return
    onConfirm()
    setIsConfirmed(false)
  }

  const DefaultIcon = severity === "low" ? Info : AlertTriangle
  const FinalIcon = TitleIcon ?? DefaultIcon

  const iconColorClass =
    severity === "high"
      ? "text-red-500"
      : severity === "medium"
      ? "text-orange-500"
      : "text-muted-foreground"

  const confirmButtonClass =
    severity === "high"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : severity === "medium"
      ? "bg-orange-500 hover:bg-orange-600 text-white"
      : "bg-foreground hover:bg-foreground/90 text-background"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Icon + title */}
          <div className="flex items-start gap-3 mb-1">
            <div className="mt-0.5 flex-shrink-0 rounded-md border border-border bg-muted p-2">
              <FinalIcon className={`h-4 w-4 ${iconColorClass}`} />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold leading-snug">
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-3 py-1 text-sm">
          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          {/* Item summary — styled as the "consequence" block in kanban modal */}
          {itemSummary && (
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
              <p className="font-semibold text-foreground">{itemSummary.title}</p>
              {itemSummary.subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {itemSummary.subtitle}
                </p>
              )}
              {itemSummary.badge && (
                <Badge variant="outline" className="mt-1.5 text-xs">
                  {itemSummary.badge}
                </Badge>
              )}
            </div>
          )}

          {/* Effects list — inside a muted block */}
          {effects.length > 0 && (
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5 space-y-1.5">
              {effects.map((effect, i) => (
                <div key={i} className="flex items-center gap-2 text-foreground">
                  <effect.icon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  <span>{effect.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Warnings — each as the "warning" row block in kanban modal */}
          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-md border border-border bg-background px-3 py-2.5"
            >
              <w.icon className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${iconColorClass}`} />
              <div className="flex-1 min-w-0">
                <p className="text-foreground leading-relaxed font-medium">{w.text}</p>
              </div>
              {w.badge && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {w.badge}
                </Badge>
              )}
            </div>
          ))}

          {/* Additional warning block */}
          {additionalWarning && (
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-background px-3 py-2.5">
              <AlertTriangle className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${iconColorClass}`} />
              <div className="min-w-0">
                <p className="font-semibold text-foreground leading-snug">
                  {additionalWarning.title}
                </p>
                <ul className="mt-1 space-y-0.5 list-disc list-inside text-muted-foreground text-xs">
                  {additionalWarning.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {additionalWarning.recommendation && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {additionalWarning.recommendation}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Confirmation checkbox */}
        <div
          className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2.5 transition-colors hover:bg-muted/40"
          onClick={() => setIsConfirmed((v) => !v)}
        >
          <Checkbox
            id="confirm-action"
            checked={isConfirmed}
            onCheckedChange={(v) => setIsConfirmed(!!v)}
            className="mt-0.5 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
          <label
            htmlFor="confirm-action"
            className="cursor-pointer text-sm text-foreground leading-relaxed select-none"
          >
            {t.common.confirmAction ||
              "Confirmo que desejo executar esta ação e entendo as consequências."}
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            {finalCancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className={`flex-1 sm:flex-none ${confirmButtonClass}`}
          >
            {finalConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
