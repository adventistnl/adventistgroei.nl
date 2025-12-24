"use client"

import * as React from "react"
import { X, FileText, Download, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign, Building2, User, Calendar, ChevronLeft, ChevronRight, Send, Info, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCurrency } from "@/contexts/currency-context"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SubsidyRequestCardData } from "@/components/projects/subsidy-request-card"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface ActivityItem {
  id: string
  name: string
  budget_amount: number
  requested_amount: number
  documents: DocumentItem[]
}
interface DocumentItem {
  id: string
  file_name: string
  file_type: "PDF" | "JPG" | "PNG" | "DOC" | "OTHER"
  document_type: "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER"
  amount: number
  file_url: string
}

interface StatusHistoryItem {
  isOpen: boolean
  onClose: () => void
  subsidy: SubsidyRequestCardData | null
}

export function ViewSubsidyModal({
  isOpen,
  onClose,
  subsidy
}: ViewSubsidyModalProps) {
  const { formatCurrency } = useCurrency()
  const { t, i18n } = useTranslation()
  const [selectedActivityIndex, setSelectedActivityIndex] = React.useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [newMessage, setNewMessage] = React.useState("")
  const [messages, setMessages] = React.useState<StatusHistoryItem[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Mock data para demonstração - em produção virá do backend
  const mockActivities: ActivityItem[] = React.useMemo(() => {
    if (!subsidy) return []
    
    return [
      {
        id: "act-1",
        name: "Material de Construção",
        budget_amount: 8000,
        requested_amount: 6000,
        documents: [
          {
            id: "doc-1",
            file_name: "fatura_materiais.pdf",
            file_type: "PDF",
            document_type: "INVOICE",
            amount: 3500,
            file_url: "#"
          },
          {
            id: "doc-2",
            file_name: "recibo_pagamento.pdf",
            file_type: "PDF",
            document_type: "RECEIPT",
            amount: 2500,
            file_url: "#"
          }
        ]
      },
      {
        id: "act-2",
        name: "Mão de Obra",
        budget_amount: 7000,
        requested_amount: 5000,
        documents: [
          {
            id: "doc-3",
            file_name: "contrato_servicos.pdf",
            file_type: "PDF",
            document_type: "CONTRACT",
            amount: 5000,
            file_url: "#"
          }
        ]
      }
    ]
  }, [subsidy])

  const mockHistory: StatusHistoryItem[] = React.useMemo(() => {
    if (!subsidy) return []
    
    const history: StatusHistoryItem[] = [
      {
        id: "hist-1",
        status: "pending",
        reason: "Solicitação criada e enviada para análise",
        changed_by: "João Silva",
        changed_at: new Date("2024-11-15T10:00:00"),
        isNew: false
      }
    ]

    if (subsidy.status === "in_review" || subsidy.status === "approved" || subsidy.status === "rejected") {
      history.push({
        id: "hist-2",
        status: "in_review",
        reason: "Documentação em análise pela equipe financeira",
        changed_by: "Maria Santos",
        changed_at: new Date("2024-11-18T14:30:00"),
        isNew: false
      })
    }

    if (subsidy.status === "approved") {
      history.push({
        id: "hist-3",
        status: "approved",
        reason: "Solicitação aprovada. Todos os documentos foram validados e o orçamento foi confirmado.",
        changed_by: "Carlos Ferreira",
        changed_at: new Date("2024-11-20T16:45:00"),
        isNew: true
      })
    }

    if (subsidy.status === "rejected") {
      history.push({
        id: "hist-3",
        status: "rejected",
        reason: "Documentação incompleta. Falta comprovante de pagamento da atividade 2.",
        changed_by: "Ana Costa",
        changed_at: new Date("2024-11-25T11:20:00"),
        isNew: true
      })
    }

    return history
  }, [subsidy])

  // Initialize messages when modal opens
  React.useEffect(() => {
    if (isOpen && mockHistory.length > 0) {
      setMessages(mockHistory)
    }
  }, [isOpen, mockHistory])

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Count new messages
  const newMessagesCount = React.useMemo(() => {
    return messages.filter(m => m.isNew).length
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: StatusHistoryItem = {
      id: `msg-${Date.now()}`,
      status: subsidy?.status || "pending",
      reason: newMessage,
      changed_by: "Você",
      changed_at: new Date(),
      isNew: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
    toast.success("Mensagem enviada")
  }

  if (!isOpen || !subsidy) return null

  const statusConfig: Record<
    SubsidyRequestCardData["status"],
    { label: string; icon: React.ElementType; className: string }
  > = {
    pending: { 
      label: "Pendente",
      icon: Clock,
      className: "text-yellow-500"
    },
    approved: { 
      label: "Aprovado",
      icon: CheckCircle2,
      className: "text-green-600"
    },
    rejected: { 
      label: "Rejeitado",
      icon: XCircle,
      className: "text-red-600"
    },
    in_review: { 
      label: "Em Análise",
      icon: AlertCircle,
      className: "text-blue-500"
    },
  }

  const currentStatus = statusConfig[subsidy.status]
  const StatusIcon = currentStatus.icon
  const currentActivity = mockActivities[selectedActivityIndex]

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INVOICE: "Fatura",
      RECEIPT: "Recibo",
      CONTRACT: "Contrato",
      PROOF_OF_PAYMENT: "Comprovante",
      OTHER: "Outro"
    }
    return labels[type] || type
  }

  const getFileIcon = (fileType: string) => {
    return <FileText className="w-4 h-4" />
  }

  const handleDownload = (document: DocumentItem) => {
    // TODO: Implementar download real
    window.open(document.file_url, '_blank')
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative w-[85vw] h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
        
        {/* Header - Minimalista */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {subsidy.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusIcon className={cn("w-3.5 h-3.5", currentStatus.className)} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {currentStatus.label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {format(new Date(subsidy.requested_at), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>

            {/* KPIs - Canto Superior Direito */}
            <TooltipProvider>
              <div className="flex items-center gap-3 mr-4">
                {/* Atividades */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {mockActivities.length}
                      </span>
                      <Info className="w-3 h-3 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Número de atividades nesta solicitação</p>
                  </TooltipContent>
                </Tooltip>

                {/* Orçamento Total */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(mockActivities.reduce((sum, act) => sum + act.budget_amount, 0))}
                      </span>
                      <Info className="w-3 h-3 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Orçamento total de todas as atividades</p>
                  </TooltipContent>
                </Tooltip>

                {/* Valor Solicitado */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-white dark:text-gray-900" />
                      <span className="text-sm font-semibold text-white dark:text-gray-900">
                        {formatCurrency(subsidy.requested_amount)}
                      </span>
                      <Info className="w-3 h-3 text-gray-300 dark:text-gray-700" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Valor total solicitado de subsídio</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* Main Panel - Activities & Documents */}
          <div className={cn(
            "flex-1 overflow-y-auto p-6 space-y-6 transition-all duration-300",
            isSidebarOpen ? "mr-0" : "mr-0"
          )}>
            
            {/* Activities Navigation */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Atividades
              </h3>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {/* Botão de colapso do chat ao lado do cabeçalho de atividades */}
                {mockActivities.map((activity, index) => (
                  <button
                    key={activity.id}
                    onClick={() => setSelectedActivityIndex(index)}
                    className={cn(
                      "flex-shrink-0 px-4 py-2.5 rounded-md border text-left transition-all",
                      selectedActivityIndex === index
                        ? "border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100"
                        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                    )}
                  >
                    <p className={cn(
                      "text-xs font-medium truncate max-w-[180px]",
                      selectedActivityIndex === index
                        ? "text-white dark:text-gray-900"
                        : "text-gray-900 dark:text-gray-100"
                    )}>
                      {activity.name}
                    </p>
                    <p className={cn(
                      "text-xs mt-1",
                      selectedActivityIndex === index 
                        ? "text-gray-200 dark:text-gray-700"
                        : "text-gray-500 dark:text-gray-400"
                    )}>
                      {formatCurrency(activity.requested_amount)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Activity Details */}
            {currentActivity && (
              <div className="space-y-4 border border-gray-200 dark:border-gray-800 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {currentActivity.name}
                  </h4>
                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                    {currentActivity.documents.length} documento(s)
                  </Badge>
                </div>

                {/* Activity Values */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Orçamento</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(currentActivity.budget_amount)}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Solicitado</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(currentActivity.requested_amount)}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Documentos
                  </h5>
                  
                  {currentActivity.documents.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 py-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-md">
                      Nenhum documento anexado
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentActivity.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {doc.file_name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {getDocumentTypeLabel(doc.document_type)}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {formatCurrency(doc.amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            className="h-8 gap-1.5 text-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Sidebar - Chat & History */}
          <div className={cn(
            "border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 transition-all duration-300 flex",
            isSidebarOpen ? "w-96" : "w-0"
          )}>
            {isSidebarOpen && (
              <div className="w-96 flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Histórico
                      </h3>
                      {newMessagesCount > 0 && (
                        <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center text-[10px] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                          {newMessagesCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((item, index) => {
                    const itemConfig = statusConfig[item.status]
                    const ItemIcon = itemConfig.icon

                    return (
                      <div key={item.id} className="relative">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                            <ItemIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                          </div>
                          
                          <div className="flex-1 pb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-[10px] border-gray-300 dark:border-gray-700">
                                {itemConfig.label}
                              </Badge>
                              {item.isNew && (
                                <Badge variant="default" className="text-[9px] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-1.5 py-0">
                                  Nova
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                              {item.reason}
                            </p>
                            
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                              <User className="w-3 h-3" />
                              <span>{item.changed_by}</span>
                              <span>•</span>
                              <span>{format(item.changed_at, "dd/MM HH:mm", { locale: ptBR })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de Mensagem */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Adicionar comentário..."
                      className="flex-1 h-9 text-xs border-gray-300 dark:border-gray-700"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size="sm"
                      className="h-9 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Sidebar Button removed (moved to activities header) */}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            {subsidy.institution_name && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Building2 className="w-3.5 h-3.5" />
                <span>{subsidy.institution_name}</span>
              </div>
            )}
            <Button variant="outline" onClick={onClose} className="ml-auto">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
