"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  X, 
  Check,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCheck,
  AlertCircle,
  Clock,
  Building,
  Church,
  Paperclip,
  Receipt
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import toast from "react-hot-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useCurrency } from "@/contexts/currency-context"
import { SubsidyRequestCardData } from "@/components/projects/subsidy-request-card"

// Interface estendida com dados completos do subsidy request
export interface SubsidyRequestViewData extends SubsidyRequestCardData {
  notes?: string
  items?: SubsidyRequestItemData[]
  institution_contribution?: number
  church_contribution?: number
  total_budget?: number
}

export interface SubsidyRequestItemData {
  activity_id: string
  activity_name: string
  requested_amount: number
  budget_amount: number
  activity_documents: SubsidyDocumentData[]
  notes?: string
}

export interface SubsidyDocumentData {
  id: string
  file_name: string
  file_type: "PDF" | "JPG" | "PNG" | "DOC" | "OTHER"
  document_type: "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER"
  amount: number
  file_url?: string
}

export interface SubsidyRequestViewModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  subsidy: SubsidyRequestViewData | null
}

export function SubsidyRequestViewModal({
  isOpen,
  onOpenChange,
  subsidy
}: SubsidyRequestViewModalProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    overview: false,
    financial: false,
    activities: false,
    documents: false,
    system: false
  })

  useEffect(() => {
    if (isOpen) {
      // Reset collapsed sections when opening
      setCollapsedSections({
        overview: false,
        financial: false,
        activities: false,
        documents: false,
        system: false
      })
    }
  }, [isOpen])

  const statusConfig: Record<SubsidyRequestViewData["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
    pending: { 
      label: "Pendente", 
      variant: "outline",
      icon: <Clock className="w-3 h-3" />
    },
    approved: { 
      label: "Aprovado", 
      variant: "default",
      icon: <Check className="w-3 h-3" />
    },
    rejected: { 
      label: "Rejeitado", 
      variant: "destructive",
      icon: <X className="w-3 h-3" />
    },
    in_review: { 
      label: "Em Análise", 
      variant: "secondary",
      icon: <AlertCircle className="w-3 h-3" />
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INVOICE: "Fatura",
      RECEIPT: "Recibo",
      CONTRACT: "Contrato",
      PROOF_OF_PAYMENT: "Comprovante de Pagamento",
      OTHER: "Outro"
    }
    return labels[type] || type
  }

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "📄"
      case "JPG":
      case "PNG":
        return "🖼️"
      case "DOC":
        return "📝"
      default:
        return "📎"
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success("Copiado para a área de transferência!", {
        duration: 2000,
        icon: '📋'
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error("Falha ao copiar")
    }
  }

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const renderCopyableField = (
    value: string | number | Date | null | undefined, 
    fieldKey: string, 
    placeholder?: string, 
    formatter?: (val: any) => string
  ) => {
    const displayValue = formatter && value !== null && value !== undefined 
      ? formatter(value) 
      : (value?.toString() || placeholder || 'Não informado')
    
    return (
      <div className="group relative py-2 text-sm flex items-center justify-between min-h-[32px]">
        <span className="text-foreground">{displayValue}</span>
        {value !== null && value !== undefined && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => copyToClipboard(displayValue, fieldKey)}
          >
            {copiedField === fieldKey ? (
              <CheckCheck className="h-3 h-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    )
  }

  const renderCollapsibleSection = (
    sectionKey: string,
    icon: React.ReactNode,
    title: string,
    content: React.ReactNode
  ) => {
    const isCollapsed = collapsedSections[sectionKey]
    
    return (
      <div className="space-y-4 pb-6 border-b border-border">
        <Collapsible open={!isCollapsed} onOpenChange={() => toggleSection(sectionKey)}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-between p-0 hover:bg-transparent">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              </div>
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          {!isCollapsed && (
            <CollapsibleContent className="pt-4">
              {content}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    )
  }

  const renderViewMode = () => {
    if (!subsidy) return null

    const currentStatus = statusConfig[subsidy.status]

    return (
      <div className="space-y-8">
        {/* Overview Section */}
        {renderCollapsibleSection(
          'overview',
          <FileText className="w-4 h-4 text-muted-foreground" />,
          "Informações Gerais",
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Título</Label>
              {renderCopyableField(subsidy.title, "title")}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Instituição</Label>
              {renderCopyableField(subsidy.institution_name, "institution")}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Data de Solicitação</Label>
              {renderCopyableField(subsidy.requested_at, "date", undefined, formatDate)}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="py-2">
                <Badge variant={currentStatus.variant} className="gap-1.5">
                  {currentStatus.icon}
                  {currentStatus.label}
                </Badge>
              </div>
            </div>

            {subsidy.notes && (
              <div>
                <Label className="text-xs text-muted-foreground">Observações Gerais</Label>
                <div className="py-2 text-sm text-foreground whitespace-pre-wrap">
                  {subsidy.notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financial Section */}
        {renderCollapsibleSection(
          'financial',
          <DollarSign className="w-4 h-4 text-muted-foreground" />,
          "Informações Financeiras",
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Valor Solicitado da Instituição</Label>
              {renderCopyableField(subsidy.requested_amount, "amount", undefined, formatCurrency)}
            </div>

            {subsidy.total_budget && (
              <div>
                <Label className="text-xs text-muted-foreground">Orçamento Total</Label>
                {renderCopyableField(subsidy.total_budget, "total_budget", undefined, formatCurrency)}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-900">Instituição</span>
                </div>
                <span className="text-lg font-bold text-blue-900">
                  {formatCurrency(subsidy.institution_contribution || subsidy.requested_amount)}
                </span>
                {subsidy.total_budget && (
                  <p className="text-xs text-blue-700 mt-1">
                    {Math.round((subsidy.institution_contribution || subsidy.requested_amount) / subsidy.total_budget * 100)}%
                  </p>
                )}
              </div>

              {subsidy.church_contribution && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Church className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-900">Igreja</span>
                  </div>
                  <span className="text-lg font-bold text-amber-900">
                    {formatCurrency(subsidy.church_contribution)}
                  </span>
                  {subsidy.total_budget && (
                    <p className="text-xs text-amber-700 mt-1">
                      {Math.round(subsidy.church_contribution / subsidy.total_budget * 100)}%
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total da Solicitação</span>
                <span className="text-lg font-bold text-foreground">
                  {formatCurrency(subsidy.requested_amount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Activities Section */}
        {subsidy.items && subsidy.items.length > 0 && renderCollapsibleSection(
          'activities',
          <Receipt className="w-4 h-4 text-muted-foreground" />,
          `Atividades (${subsidy.items.length})`,
          <div className="space-y-4">
            {subsidy.items.map((item, index) => (
              <div key={item.activity_id} className="p-4 border rounded-lg bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      {index + 1}. {item.activity_name}
                    </h4>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground">{item.notes}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {formatCurrency(item.budget_amount)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Valor Solicitado</Label>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.requested_amount)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Documentos</Label>
                    <p className="text-sm font-semibold text-foreground">
                      {item.activity_documents.length} arquivo(s)
                    </p>
                  </div>
                </div>

                {/* Documents List */}
                {item.activity_documents.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Documentos Anexados</Label>
                    {item.activity_documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded border text-xs">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-base">{getFileTypeIcon(doc.file_type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{doc.file_name}</p>
                            <p className="text-muted-foreground">{getDocumentTypeLabel(doc.document_type)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="secondary" className="text-xs">
                            {formatCurrency(doc.amount)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* System Information */}
        {renderCollapsibleSection(
          'system',
          <Calendar className="w-4 h-4 text-muted-foreground" />,
          "Informações do Sistema",
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">ID da Solicitação</Label>
              {renderCopyableField(subsidy.id, "id")}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Data de Criação</Label>
              {renderCopyableField(subsidy.requested_at, "created_at", undefined, formatDate)}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!subsidy) return null

  const currentStatus = statusConfig[subsidy.status]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{subsidy.title}</span>
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={currentStatus.variant} className="gap-1.5">
                  {currentStatus.icon}
                  {currentStatus.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(subsidy.requested_at)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-1">
            {renderViewMode()}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              size="sm"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
