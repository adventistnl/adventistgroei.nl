"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { 
  Trash2,
  AlertTriangle,
  FileText,
  CheckCircle,
  DollarSign,
  Activity,
  XCircle,
  File,
  ExternalLink
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { projectTranslations } from "@/lib/translations/projects"
import { ActivityData } from "@/components/projects/project-subsidies-table"

interface DeleteActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  activity?: ActivityData
}

export function DeleteActivityModal({ isOpen, onClose, onConfirm, activity }: DeleteActivityModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  if (!activity) {
    return null
  }

  const hasReceipts = activity.receiptsCount > 0
  const hasApprovedReceipts = activity.receipts.some(r => r.approved)
  const approvedReceiptsCount = activity.receipts.filter(r => r.approved).length
  const totalApprovedAmount = activity.receipts.filter(r => r.approved).reduce((sum, r) => sum + r.amount, 0)
  
  // Check if activity might be part of reports (simulated)
  const isPartOfReport = activity.approvedAmount > 0 && hasApprovedReceipts
  
  const getSeverityLevel = () => {
    if (isPartOfReport && hasApprovedReceipts) return "high"
    if (hasReceipts) return "medium"
    return "low"
  }

  const severityLevel = getSeverityLevel()

  const getSeverityColor = () => {
    switch (severityLevel) {
      case "high": return "border-red-500 bg-red-50"
      case "medium": return "border-yellow-500 bg-yellow-50"
      default: return "border-gray-500 bg-gray-50"
    }
  }

  const getSeverityIcon = () => {
    switch (severityLevel) {
      case "high": return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "medium": return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default: return <Trash2 className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            {t.activity.deleteActivity}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>Esta ação irá excluir permanentemente a atividade e todos os dados relacionados.</p>
            
            {/* Activity Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Atividade</span>
                  <Badge variant="outline">
                    R$ {activity.budget_amount.toLocaleString()}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Impact Warning */}
            <Card className={`border-2 ${getSeverityColor()}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {getSeverityIcon()}
                  Impacto da Exclusão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Receipts Impact */}
                {hasReceipts && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">Recibos que serão excluídos:</span>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {activity.receiptsCount} recibos
                      </Badge>
                    </div>
                    
                    {hasApprovedReceipts && (
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{approvedReceiptsCount} recibos aprovados</span>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            R$ {totalApprovedAmount.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <XCircle className="w-3 h-3 text-yellow-500" />
                          <span>{activity.receiptsCount - approvedReceiptsCount} recibos pendentes</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Consequences */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-red-600">Consequências desta ação:</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-red-500" />
                      <span>A atividade será removida permanentemente</span>
                    </div>
                    
                    {hasReceipts && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span>Todos os {activity.receiptsCount} recibos serão excluídos</span>
                      </div>
                    )}
                    
                    {hasApprovedReceipts && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-red-500" />
                        <span>R$ {totalApprovedAmount.toLocaleString()} em recibos aprovados serão perdidos</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-red-500" />
                      <span>R$ {activity.budget_amount.toLocaleString()} retornará ao orçamento do subsídio</span>
                    </div>
                  </div>
                </div>

                {/* Report Impact Warning */}
                {isPartOfReport && (
                  <>
                    <Separator />
                    <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                      <div className="flex items-center gap-2 mb-2">
                        <File className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          Impacto em Relatórios
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-red-600">
                        <p>• Esta atividade pode fazer parte de relatórios anuais</p>
                        <p>• A exclusão pode prejudicar aprovações futuras</p>
                        <p>• Dados financeiros em relatórios ficarão inconsistentes</p>
                        <p>• Auditoria pode identificar discrepâncias</p>
                      </div>
                      <div className="mt-2 p-2 bg-red-200 rounded text-xs text-red-700 font-medium">
                        ⚠️ Recomendação: Considere desativar ao invés de excluir
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Esta ação não pode ser desfeita
                    </span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Todos os dados relacionados a esta atividade serão perdidos permanentemente
                  </p>
                </div>
              </CardContent>
            </Card>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </AlertDialogCancel>
          
          {severityLevel === "high" ? (
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <AlertDialogAction
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Mesmo Assim
              </AlertDialogAction>
              <p className="text-xs text-center text-red-600">
                Você está ciente dos riscos
              </p>
            </div>
          ) : (
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Confirmar Exclusão
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
