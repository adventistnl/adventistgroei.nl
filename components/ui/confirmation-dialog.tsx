"use client"

import * as React from "react"
import { 
  AlertTriangle,
  Trash2,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { useTranslation } from "react-i18next"

export interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  severity?: "low" | "medium" | "high"
  titleIcon?: React.ComponentType<any>
  actionIcon?: React.ComponentType<any>
  itemSummary?: {
    title: string
    subtitle?: string
    badge?: string
  }
  warnings?: Array<{
    icon: React.ComponentType<any>
    text: string
    badge?: string
  }>
  effects?: Array<{
    icon: React.ComponentType<any>
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
  actionIcon: ActionIcon,
  itemSummary,
  warnings = [],
  effects = [],
  additionalWarning
}: ConfirmationDialogProps) {
  const { t } = useTranslation()
  
  const finalConfirmText = confirmText || t('common.confirm')
  const finalCancelText = cancelText || t('common.cancel')

  const getSeverityColor = () => {
    switch (severity) {
      case "high": return "border-red-500 bg-red-50 dark:bg-red-900/20"
      case "medium": return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      default: return "border-gray-500 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const getSeverityIcon = () => {
    switch (severity) {
      case "high": return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "medium": return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default: return <Info className="w-5 h-5 text-gray-600" />
    }
  }
  
  const DefaultTitleIcon = severity === 'high' ? AlertTriangle : (severity === 'medium' ? AlertTriangle : Info)
  const FinalTitleIcon = TitleIcon || DefaultTitleIcon
  
  const DefaultActionIcon = severity === 'high' ? AlertTriangle : CheckCircle
  const FinalActionIcon = ActionIcon || DefaultActionIcon

  const titleIconClass = severity === 'high' ? "text-red-600" : (severity === 'medium' ? "text-yellow-600" : "text-gray-600")

  const getConfirmButtonClass = () => {
    switch (severity) {
      case "high": return "bg-red-600 hover:bg-red-700 text-white"
      case "medium": return "bg-yellow-600 hover:bg-yellow-700 text-white"
      default: return "bg-gray-600 hover:bg-gray-700 text-white"
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 ${titleIconClass}`}>
            <FinalTitleIcon className="w-5 h-5" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>{description}</p>
            
            {/* Item Summary */}
            {itemSummary && (
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{itemSummary.title}</span>
                    {itemSummary.badge && (
                      <Badge variant="outline">
                        {itemSummary.badge}
                      </Badge>
                    )}
                  </div>
                  {itemSummary.subtitle && (
                    <p className="text-sm text-muted-foreground">{itemSummary.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <Card className={`border-2 ${getSeverityColor()}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon()}
                    <span className="text-sm font-medium">{t('common.impact')}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {warnings.map((warning, index) => {
                      const Icon = warning.icon
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Icon className="w-4 h-4 text-red-500" />
                          <span>{warning.text}</span>
                          {warning.badge && (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              {warning.badge}
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Effects */}
            {effects.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-600">{t('common.consequences')}</p>
                <div className="space-y-2">
                  {effects.map((effect, index) => {
                    const Icon = effect.icon
                    return (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Icon className="w-4 h-4 text-red-500" />
                        <span>{effect.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Additional Warning */}
            {additionalWarning && (
              <>
                <Separator />
                <div className="p-3 bg-red-100 rounded-lg border border-red-300 dark:bg-red-900/20 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      {additionalWarning.title}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-red-600">
                    {additionalWarning.items.map((item, index) => (
                      <p key={index}>• {item}</p>
                    ))}
                  </div>
                  {additionalWarning.recommendation && (
                    <div className="mt-2 p-2 bg-red-200 rounded text-xs text-red-700 font-medium dark:bg-red-800/30">
                      ⚠️ {additionalWarning.recommendation}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="p-3 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  {t('common.undone')}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto">
            {finalCancelText}
          </AlertDialogCancel>
          
          {severity === "high" ? (
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <AlertDialogAction
                onClick={onConfirm}
                className={`${getConfirmButtonClass()} w-full`}
              >
                <FinalActionIcon className="w-4 h-4 mr-2" />
                {finalConfirmText}
              </AlertDialogAction>
              <p className="text-xs text-center text-red-600">
                {t('common.riskAware')}
              </p>
            </div>
          ) : (
            <AlertDialogAction
              onClick={onConfirm}
              className={`${getConfirmButtonClass()} w-full sm:w-auto`}
            >
              <FinalActionIcon className="w-4 h-4 mr-2" />
              {finalConfirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
