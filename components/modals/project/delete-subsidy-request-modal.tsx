"use client"

import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Trash2,
  FileText,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Database,
  Building,
  DollarSign,
  Calendar
} from "lucide-react"
import toast from "react-hot-toast"
import { SubsidyRequestCardData } from "@/components/projects/subsidy-request-card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useCurrency } from "@/contexts/currency-context"
import { DELETE_SUBSIDY_REQUEST } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"

export interface DeleteSubsidyRequestModalProps {
  isOpen: boolean
  onOpenChangeAction: (open: boolean) => void
  subsidy: SubsidyRequestCardData | null
  onSuccess?: (deletedSubsidy: SubsidyRequestCardData) => void
}

export function DeleteSubsidyRequestModal({
  isOpen,
  onOpenChangeAction,
  subsidy,
  onSuccess
}: DeleteSubsidyRequestModalProps) {
  const { formatCurrency } = useCurrency()
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  const [deleteSubsidyRequest, { loading: isLoading }] = useMutation(DELETE_SUBSIDY_REQUEST, {
    onCompleted: () => {
      toast.success('✅ Solicitação excluída com sucesso', { duration: 3000 })
      if (onSuccess && subsidy) {
        onSuccess(subsidy)
      }
      onOpenChangeAction(false)
      // Reset form state
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
    },
    onError: (error) => {
      toast.error(`Erro ao excluir solicitação: ${error.message}`)
      console.error('Error deleting subsidy request:', error)
    }
  })

  const statusConfig: Record<SubsidyRequestCardData["status"], { label: string; className: string }> = {
    pending: { label: "Pendente", className: "bg-amber-50 text-amber-700 border-amber-200" },
    approved: { label: "Aprovado", className: "bg-green-50 text-green-700 border-green-200" },
    rejected: { label: "Rejeitado", className: "bg-red-50 text-red-700 border-red-200" },
    in_review: { label: "Em Análise", className: "bg-blue-50 text-blue-700 border-blue-200" }
  }

  const handleSubmit = async () => {
    if (!subsidy) return

    try {
      await deleteSubsidyRequest({
        variables: { id: subsidy.id }
      })
    } catch (error) {
      // Error already handled by mutation onError
      console.error('Failed to delete subsidy request:', error)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
      onOpenChangeAction(false)
    }
  }

  const isDeleteEnabled = 
    understoodConsequences && 
    finalConfirmation.toLowerCase() === 'delete subsidy' && 
    !isLoading

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  if (!subsidy) return null

  const currentStatus = statusConfig[subsidy.status]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg mb-2">
            Excluir Solicitação de Subsídio
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Esta ação não pode ser desfeita. A solicitação e todos os dados relacionados serão permanentemente excluídos.
          </DialogDescription>
        </DialogHeader>
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            
            {/* Subsidy Information */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
              {/* Icon */}
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              
              {/* Information */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {subsidy.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${currentStatus.className}`}>
                    {currentStatus.label}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  {subsidy.institution_name && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building className="w-3 h-3" />
                      <span>{subsidy.institution_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(subsidy.requested_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatCurrency(subsidy.requested_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-900 dark:text-red-200">
                  Ação Irreversível
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Uma vez excluída, esta solicitação não poderá ser recuperada. Certifique-se de que deseja prosseguir.
                </p>
              </div>
            </div>

            {/* Collapsible Consequences */}
            <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" size="sm">
                  <span className="flex items-center gap-2 text-xs">
                    Ver Consequências da Exclusão
                  </span>
                  {consequencesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-4">
                {/* Data Loss Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">Perda de Dados</p>
                    <p className="text-xs text-muted-foreground">
                      Todos os dados relacionados a esta solicitação, incluindo documentos anexados e histórico, serão permanentemente excluídos.
                    </p>
                  </div>
                </div>
                
                {/* Financial Records Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">Registros Financeiros</p>
                    <p className="text-xs text-muted-foreground">
                      O valor de {formatCurrency(subsidy.requested_amount)} será removido dos registros. Certifique-se de que isso não afetará relatórios ou auditorias.
                    </p>
                  </div>
                </div>
                
                {/* Institutional Communication Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Building className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">Comunicação Institucional</p>
                    <p className="text-xs text-muted-foreground">
                      Se esta solicitação já foi comunicada à instituição, você precisará informá-los sobre a exclusão.
                    </p>
                  </div>
                </div>

                {/* Approved Status Warning */}
                {subsidy.status === 'approved' && (
                  <div className="flex items-start gap-3 p-3 border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-red-900 dark:text-red-200">Solicitação Aprovada</p>
                      <p className="text-xs text-red-700 dark:text-red-300">
                        Esta solicitação foi aprovada. A exclusão pode impactar o orçamento aprovado e processos financeiros em andamento.
                      </p>
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

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
                    Eu compreendo as consequências
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    Confirmo que li e entendo que esta ação é irreversível e resultará na perda permanente de todos os dados relacionados.
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Digite <span className="font-mono font-bold">delete subsidy</span> para confirmar
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder="delete subsidy"
                    className="h-10 font-mono"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Digite exatamente "delete subsidy" (em letras minúsculas) para habilitar a exclusão
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed Footer */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading} 
              size="sm" 
              className="text-xs"
            >
              Cancelar
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
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
                  Excluir Solicitação
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
