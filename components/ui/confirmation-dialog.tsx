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
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <AlertDialogTitle className="text-gray-900">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex gap-3 pt-6">
          <AlertDialogCancel 
            onClick={onClose} 
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
          >
            {finalCancelText}
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
          >
            {finalConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
