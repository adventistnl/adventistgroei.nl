"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { 
  Trash2,
  AlertTriangle,
  Activity,
  FileText,
  CheckCircle,
  DollarSign
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
import { projectTranslations } from "@/lib/translations/projects"
import { SubsidyRequestData } from "@/components/projects/project-subsidies-table"

interface DeleteSubsidyModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  subsidy?: SubsidyRequestData
}

export function DeleteSubsidyModal({ isOpen, onClose, onConfirm, subsidy }: DeleteSubsidyModalProps) {
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  if (!subsidy) {
    return null
  }

  const totalReceipts = subsidy.activities.reduce((sum, activity) => sum + (activity.receiptsCount || 0), 0)
  const totalActivities = subsidy.activities.length

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            {t.subsidy.deleteConfirmTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>{t.subsidy.deleteConfirmDesc}</p>
            
            {/* Subsidy Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.subsidy.requestLabel}</span>
                  <Badge variant="outline">
                    {formatCurrency(subsidy.total_budget)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {subsidy.description}
                </p>
              </CardContent>
            </Card>

            {/* Impact Summary */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-600">{t.subsidy.deleteEffects}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-red-500" />
                  <span>{t.subsidy.deleteEffect1}</span>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {totalActivities} {t.subsidy.activitiesLower}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>{t.subsidy.deleteEffect2}</span>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {totalReceipts} {t.subsidy.receiptsLower}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                  <span>{t.subsidy.deleteEffect3}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-red-500" />
                  <span>{t.subsidy.deleteEffect4}</span>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {formatCurrency(subsidy.approved_amount)} {t.subsidy.approvedLower}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  {t.common.irreversible}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {t.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t.common.deletePermanently}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
