"use client"

import * as React from "react"
import { X, FileText, Download, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign, Building2, User, Calendar, ChevronLeft, ChevronRight, Send, Info, MessageCircle, Check, Ban, AtSign, Pencil, Trash2, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/contexts/currency-context"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SubsidyRequestCardData } from "@/components/projects/subsidy-request-card"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { useSubsidyReceipts, SubsidyReceipt } from "@/hooks/use-subsidy-receipts"
import { useMutation, useQuery } from "@apollo/client"
import { UPDATE_SUBSIDY_REQUEST, APPROVE_SUBSIDY_REQUEST, REJECT_SUBSIDY_REQUEST } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"
import { GET_SUBSIDY_STATUS_HISTORY } from "@/graphql/queries/SUBSIDY_STATUS_HISTORY_QUERIES"

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
  is_validated?: boolean
  validated_by?: string
  validated_at?: string
  validation_note?: string
}

interface StatusHistoryItem {
  id: string
  status: "pending" | "in_review" | "approved" | "rejected"
  reason: string
  changed_by: string
  changed_at: Date
  isNew: boolean
}

interface ViewSubsidyModalProps {
  isOpen: boolean
  onClose: () => void
  subsidy: SubsidyRequestCardData | null
  /** Optional callback when subsidy is updated (for refetching data) */
  onSubsidyUpdated?: () => void
}

export function ViewSubsidyModal({
  isOpen,
  onClose,
  subsidy,
  onSubsidyUpdated
}: ViewSubsidyModalProps) {
  // Early return BEFORE any hooks to maintain consistent hook order
  if (!isOpen || !subsidy) {
    return null
  }

  const { formatCurrency } = useCurrency()
  const { t, i18n } = useTranslation()
  const [selectedActivityIndex, setSelectedActivityIndex] = React.useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [newMessage, setNewMessage] = React.useState("")
  const [messages, setMessages] = React.useState<StatusHistoryItem[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [documentValidations, setDocumentValidations] = React.useState<Record<string, { note: string; isValid: boolean | null }>>({})
  const [mentionMode, setMentionMode] = React.useState<string | null>(null)
  const [commentingDocument, setCommentingDocument] = React.useState<{ id: string; name: string } | null>(null)
  const [documentComment, setDocumentComment] = React.useState("")
  const [editingMessage, setEditingMessage] = React.useState<string | null>(null)
  const [chatFilterActivity, setChatFilterActivity] = React.useState<string | null>(null)
  const [currentSubsidyStatus, setCurrentSubsidyStatus] = React.useState(subsidy?.status || "pending")
  const [currentPriority, setCurrentPriority] = React.useState<"low" | "medium" | "high">("medium")
  const [mentionStatus, setMentionStatus] = React.useState<"pending" | "in_review" | "approved" | "rejected" | null>(null)
  const [mentionPriority, setMentionPriority] = React.useState<"low" | "medium" | "high" | null>(null)
  const chatInputRef = React.useRef<HTMLInputElement>(null)
  const [loadingDocuments, setLoadingDocuments] = React.useState(false)
  const [receipts, setReceipts] = React.useState<SubsidyReceipt[]>([])

  /* 
   * Sync local status state when subsidy prop changes
   * This ensures that if the parent refreshes the data, the modal shows the correct status
   */
  React.useEffect(() => {
    if (subsidy?.status) {
      setCurrentSubsidyStatus(subsidy.status as any)
    }
  }, [subsidy])

  // Hook for fetching and managing subsidy receipts
  const {
    fetchReceipts,
    validateReceipt,
    rejectReceipt,
    downloadReceipt,
    loading: receiptsLoading,
    validating: receiptsValidating,
  } = useSubsidyReceipts({
    subsidyRequestId: subsidy?.id,
  })

  // Mutations for updating subsidy status
  const [updateSubsidyRequest] = useMutation(UPDATE_SUBSIDY_REQUEST, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Status atualizado com sucesso!")
      // Trigger callback to refresh data in parent
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`)
      console.error("Error updating subsidy:", error)
    }
  })

  const [approveSubsidyRequest] = useMutation(APPROVE_SUBSIDY_REQUEST, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Subsídio aprovado com sucesso!")
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      toast.error(`Erro ao aprovar subsídio: ${error.message}`)
      console.error("Error approving subsidy:", error)
    }
  })

  const [rejectSubsidyRequest] = useMutation(REJECT_SUBSIDY_REQUEST, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Subsídio rejeitado")
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      toast.error(`Erro ao rejeitar subsídio: ${error.message}`)
      console.error("Error rejecting subsidy:", error)
    }
  })

  // Status ID mapping (from database)
  const STATUS_IDS = {
    pending: 'e91a39fa-08d2-4900-ba0b-6cd5cbcb0a1d',
    approved: 'eb9dfcc0-752c-4cfe-a8db-7e7171a4e965',
    rejected: '2898eb33-ab05-4fdf-bf46-732c1e41a870',
    in_review: '5f037eb0-8b5e-4156-b3fc-2c2e327e79f5',
  }

  // Fetch receipts when modal opens
  React.useEffect(() => {
    if (isOpen && subsidy?.id) {
      setLoadingDocuments(true)
      fetchReceipts(subsidy.id)
        .then((fetchedReceipts) => {
          console.log('📄 Fetched receipts for subsidy:', fetchedReceipts)
          setReceipts(fetchedReceipts || [])
        })
        .catch((error) => {
          console.error('Error fetching receipts:', error)
          toast.error('Erro ao carregar documentos')
        })
        .finally(() => {
          setLoadingDocuments(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, subsidy?.id])

  // Helper to map receipt type to document type
  const mapReceiptTypeToDocType = (type: string): "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER" => {
    const typeMap: Record<string, "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER"> = {
      'invoice': 'INVOICE',
      'receipt': 'RECEIPT',
      'contract': 'CONTRACT',
      'proof_of_payment': 'PROOF_OF_PAYMENT',
      'image': 'RECEIPT',
      'pdf': 'INVOICE',
    }
    return typeMap[type?.toLowerCase()] || 'OTHER'
  }

  // Helper to get file type from filename
  const getFileType = (filename: string): "PDF" | "JPG" | "PNG" | "DOC" | "OTHER" => {
    const ext = filename.split('.').pop()?.toUpperCase()
    if (ext === "PDF" || ext === "JPG" || ext === "PNG" || ext === "DOC") {
      return ext as "PDF" | "JPG" | "PNG" | "DOC"
    }
    return "OTHER"
  }

  // Transform subsidy items to activities format with real documents
  const activities = React.useMemo<ActivityItem[]>(() => {
    if (!subsidy || !subsidy.items) return []

    // Group receipts by activity_id
    const receiptsByActivity = receipts.reduce((acc, receipt) => {
      const activityId = receipt.project_activities_id
      if (!acc[activityId]) {
        acc[activityId] = []
      }
      acc[activityId].push(receipt)
      return acc
    }, {} as Record<string, SubsidyReceipt[]>)

    return subsidy.items.map(item => {
      // Get receipts for this activity
      const activityReceipts = receiptsByActivity[item.activity_id] || []

      // Transform receipts to documents format
      // Status logic: 
      // - Pendente: is_validated === false
      // - Aprovado: is_validated === true && approved === true
      // - Rejeitado: is_validated === true && approved === false
      const documents: DocumentItem[] = activityReceipts.map(receipt => {
        let validationStatus: boolean | undefined
        if (!receipt.is_validated) {
          validationStatus = undefined // Pendente
        } else if (receipt.approved) {
          validationStatus = true // Aprovado
        } else {
          validationStatus = false // Rejeitado
        }

        return {
          id: receipt.id,
          file_name: receipt.filename,
          file_type: getFileType(receipt.filename),
          document_type: mapReceiptTypeToDocType(receipt.type),
          amount: receipt.amount || 0,
          file_url: receipt.file_url,
          is_validated: validationStatus,
          validated_by: receipt.validated_by || undefined,
          validated_at: receipt.validated_at || undefined,
          validation_note: undefined, // Not available in current receipt structure
        }
      })

      return {
        id: item.activity_id,
        name: item.activity_name,
        budget_amount: item.budget_amount,
        requested_amount: item.requested_amount,
        documents: documents
      }
    })
  }, [subsidy, receipts])

  // Fetch real status history from backend
  const { data: historyData, loading: historyLoading } = useQuery(
    GET_SUBSIDY_STATUS_HISTORY,
    {
      variables: { subsidyRequestId: subsidy?.id },
      skip: !subsidy?.id,
    }
  )

  // Transform history data from backend to UI format
  const statusHistory = React.useMemo<StatusHistoryItem[]>(() => {
    if (!historyData?.getSubsidyStatusHistory) return []
    
    return historyData.getSubsidyStatusHistory.map((item: any) => ({
      id: item.id,
      status: item.status.name.toLowerCase(),
      reason: item.reason || '',
      changed_by: item.user.name,
      changed_at: new Date(item.changed_at),
      isNew: false
    }))
  }, [historyData])

  // Initialize messages when modal opens
  React.useEffect(() => {
    if (isOpen && statusHistory.length > 0) {
      setMessages(statusHistory)
    }
  }, [isOpen, statusHistory])

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Count new messages
  const newMessagesCount = React.useMemo(() => {
    return messages.filter(m => m.isNew).length
  }, [messages])

  // Focus input when entering comment or mention mode
  React.useEffect(() => {
    if (commentingDocument || mentionMode || editingMessage) {
      chatInputRef.current?.focus()
    }
  }, [commentingDocument, mentionMode, editingMessage])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Handle editing existing message
    if (editingMessage) {
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage 
          ? { ...msg, reason: newMessage, changed_at: new Date() }
          : msg
      ))
      toast.success("Comentário atualizado")
      setEditingMessage(null)
      setNewMessage("")
      return
    }

    // Handle document comment
    if (commentingDocument) {
      const message: StatusHistoryItem = {
        id: `msg-${Date.now()}`,
        status: "in_review",
        reason: `Comentário sobre documento "${commentingDocument.name}": ${newMessage}`,
        changed_by: "Admin User",
        changed_at: new Date(),
        isNew: false
      }
      setMessages(prev => [...prev, message])
      toast.success("Comentário adicionado")
      setCommentingDocument(null)
      setNewMessage("")
      return
    }

    // Handle document rejection
    if (mentionMode) {
      handleValidateDocument(mentionMode, false)
      return
    }

    // Handle regular message
    let messageText = newMessage
    
    // Add status mention if present
    if (mentionStatus) {
      const statusLabel = statusConfig[mentionStatus].label
      messageText = `@Status: ${statusLabel} - ${messageText}`
    }
    
    // Add priority mention if present
    if (mentionPriority) {
      const priorityLabel = mentionPriority === 'high' ? 'Alta' : mentionPriority === 'medium' ? 'Média' : 'Baixa'
      messageText = `@Prioridade: ${priorityLabel} - ${messageText}`
    }
    
    const message: StatusHistoryItem = {
      id: `msg-${Date.now()}`,
      status: subsidy?.status || "pending",
      reason: messageText,
      changed_by: "Você",
      changed_at: new Date(),
      isNew: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
    setMentionStatus(null)
    setMentionPriority(null)
    toast.success("Mensagem enviada")
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    toast.success("Comentário deletado")
  }

  const handleEditMessage = (message: StatusHistoryItem) => {
    setEditingMessage(message.id)
    setNewMessage(message.reason)
    // Clear other modes
    setCommentingDocument(null)
    setMentionMode(null)
  }

  const handleValidateDocument = async (docId: string, isValid: boolean) => {
    // Buscar informações do documento
    let docName = ''
    for (const act of activities) {
      const doc = act.documents.find(d => d.id === docId)
      if (doc) {
        docName = doc.file_name
        break
      }
    }

    if (isValid) {
      // Validação direta sem nota - chamar API
      try {
        await validateReceipt(docId)
        
        // Adicionar mensagem ao histórico
        const approvalMessage: StatusHistoryItem = {
          id: `msg-${Date.now()}`,
          status: "in_review",
          reason: `Documento "${docName}" foi validado e aprovado.`,
          changed_by: "Admin User",
          changed_at: new Date(),
          isNew: false
        }
        setMessages(prev => [...prev, approvalMessage])
        
        toast.success("Documento validado com sucesso")
        setMentionMode(null)

        // Refetch receipts to update the list
        const updatedReceipts = await fetchReceipts(subsidy?.id)
        setReceipts(updatedReceipts || [])
        
        // Notify parent to refresh subsidy data (status might have changed)
        onSubsidyUpdated?.()
      } catch (error) {
        console.error('Error validating document:', error)
        // Error toast is already shown by the hook
      }
    } else {
      // Rejeição com nota obrigatória
      if (!newMessage.trim()) {
        toast.error("Adicione um motivo para a rejeição")
        return
      }
      
      // Call API to reject document
      try {
        await rejectReceipt(docId, newMessage)
        
        // Adicionar mensagem ao histórico com motivo da rejeição
        const rejectionMessage: StatusHistoryItem = {
          id: `msg-${Date.now()}`,
          status: "rejected",
          reason: `Documento "${docName}" foi rejeitado. Motivo: ${newMessage}`,
          changed_by: "Admin User",
          changed_at: new Date(),
          isNew: false
        }
        setMessages(prev => [...prev, rejectionMessage])
        
        toast.success("Documento rejeitado")
        setMentionMode(null)
        setNewMessage("")

        // Refetch receipts to update the list
        const updatedReceipts = await fetchReceipts(subsidy?.id)
        setReceipts(updatedReceipts || [])
        
        // Notify parent to refresh subsidy data (status might have changed)
        onSubsidyUpdated?.()
      } catch (error) {
        console.error('Error rejecting document:', error)
        // Error toast is already shown by the hook
      }
    }
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

  const currentStatus = statusConfig[currentSubsidyStatus]
  const StatusIcon = currentStatus.icon
  const currentActivity = activities[selectedActivityIndex]

  // Helper function to get activity document status
  const getActivityDocumentStatus = (activity: ActivityItem) => {
    const docs = activity.documents
    if (docs.length === 0) return 'none'
    const allApproved = docs.every(d => d.is_validated === true)
    const anyRejected = docs.some(d => d.is_validated === false)
    const anyPending = docs.some(d => d.is_validated === undefined)
    
    if (allApproved) return 'approved'
    if (anyRejected) return 'rejected'
    if (anyPending) return 'pending'
    return 'none'
  }

  // Filter messages by activity if filter is active
  const filteredMessages = React.useMemo(() => {
    if (!chatFilterActivity) return messages
    return messages.filter(msg => {
      // Check if message mentions the filtered activity
      const activity = activities.find(a => a.id === chatFilterActivity)
      return activity && msg.reason.toLowerCase().includes(activity.name.toLowerCase())
    })
  }, [messages, chatFilterActivity, activities])

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

  const handleDownload = async (document: DocumentItem) => {
    try {
      // Use the same approach as activity-documents-section
      await downloadReceipt(document.id, document.file_name)
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Erro ao fazer download do documento')
    }
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
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {subsidy.title}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Solicitado em {format(new Date(subsidy.requested_at), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>

            {/* KPIs + Dropdowns - Canto Superior Direito */}
            <TooltipProvider>
              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer min-w-[140px] justify-between",
                        currentSubsidyStatus === 'approved' && "bg-green-50 dark:bg-green-950/30 border-green-500",
                        currentSubsidyStatus === 'rejected' && "bg-red-50 dark:bg-red-950/30 border-red-500",
                        currentSubsidyStatus === 'in_review' && "bg-blue-50 dark:bg-blue-950/30 border-blue-500",
                        currentSubsidyStatus === 'pending' && "bg-amber-50 dark:bg-amber-950/30 border-amber-500"
                      )}>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={cn(
                            "w-4 h-4",
                            currentSubsidyStatus === 'approved' && "text-green-600 dark:text-green-400",
                            currentSubsidyStatus === 'rejected' && "text-red-600 dark:text-red-400",
                            currentSubsidyStatus === 'in_review' && "text-blue-600 dark:text-blue-400",
                            currentSubsidyStatus === 'pending' && "text-amber-600 dark:text-amber-400"
                          )} />
                          <span className={cn(
                            "text-sm font-semibold",
                            currentSubsidyStatus === 'approved' && "text-green-700 dark:text-green-400",
                            currentSubsidyStatus === 'rejected' && "text-red-700 dark:text-red-400",
                            currentSubsidyStatus === 'in_review' && "text-blue-700 dark:text-blue-400",
                            currentSubsidyStatus === 'pending' && "text-amber-700 dark:text-amber-400"
                          )}>
                            {currentStatus.label}
                          </span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-500" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={async () => {
                      setCurrentSubsidyStatus('pending')
                      setMentionStatus('pending')
                      setNewMessage('Alteração de status para Pendente')
                      chatInputRef.current?.focus()
                      // Update in backend
                      try {
                        await updateSubsidyRequest({
                          variables: {
                            id: subsidy.id,
                            data: {
                              subsidy_status_id: STATUS_IDS.pending
                            }
                          }
                        })
                      } catch (error) {
                        console.error('Error updating status:', error)
                      }
                    }}>
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      Pendente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                      setCurrentSubsidyStatus('in_review')
                      setMentionStatus('in_review')
                      setNewMessage('Alteração de status para Em Análise')
                      chatInputRef.current?.focus()
                      // Update in backend
                      try {
                        await updateSubsidyRequest({
                          variables: {
                            id: subsidy.id,
                            data: {
                              subsidy_status_id: STATUS_IDS.in_review
                            }
                          }
                        })
                      } catch (error) {
                        console.error('Error updating status:', error)
                      }
                    }}>
                      <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                      Em Análise
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                      setCurrentSubsidyStatus('approved')
                      setMentionStatus('approved')
                      setNewMessage('Alteração de status para Aprovado')
                      chatInputRef.current?.focus()
                      // Approve subsidy - use specific mutation
                      try {
                        await approveSubsidyRequest({
                          variables: {
                            id: subsidy.id,
                            approved_amount: subsidy.requested_amount
                          }
                        })
                      } catch (error) {
                        console.error('Error approving subsidy:', error)
                      }
                    }}>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Aprovado
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                      setCurrentSubsidyStatus('rejected')
                      setMentionStatus('rejected')
                      const reason = prompt('Motivo da rejeição:')
                      if (reason) {
                        setNewMessage(`Alteração de status para Rejeitado: ${reason}`)
                        chatInputRef.current?.focus()
                        // Reject subsidy
                        try {
                          await rejectSubsidyRequest({
                            variables: {
                              id: subsidy.id,
                              rejection_reason: reason
                            }
                          })
                        } catch (error) {
                          console.error('Error rejecting subsidy:', error)
                        }
                      }
                    }}>
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Rejeitado
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Priority Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 cursor-pointer min-w-[140px] justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            currentPriority === 'high' && "bg-red-500",
                            currentPriority === 'medium' && "bg-yellow-500",
                            currentPriority === 'low' && "bg-green-500"
                          )} />
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {currentPriority === 'high' && 'Alta'}
                            {currentPriority === 'medium' && 'Média'}
                            {currentPriority === 'low' && 'Baixa'}
                          </span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-500" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Alterar Prioridade</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      setCurrentPriority('high')
                      setMentionPriority('high')
                      setNewMessage('Alteração de prioridade para Alta')
                      chatInputRef.current?.focus()
                      toast.success('Prioridade alterada para Alta')
                    }}>
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      Alta
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setCurrentPriority('medium')
                      setMentionPriority('medium')
                      setNewMessage('Alteração de prioridade para Média')
                      chatInputRef.current?.focus()
                      toast.success('Prioridade alterada para Média')
                    }}>
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                      Média
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setCurrentPriority('low')
                      setMentionPriority('low')
                      setNewMessage('Alteração de prioridade para Baixa')
                      chatInputRef.current?.focus()
                      toast.success('Prioridade alterada para Baixa')
                    }}>
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Baixa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Atividades */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 min-w-[140px]">
                      <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {activities.length}
                      </span>
                      <Info className="w-3 h-3 text-gray-400 ml-auto" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Número de atividades nesta solicitação</p>
                  </TooltipContent>
                </Tooltip>

                {/* Orçamento Total */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 min-w-[140px]">
                      <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(activities.reduce((sum, act) => sum + act.budget_amount, 0))}
                      </span>
                      <Info className="w-3 h-3 text-gray-400 ml-auto" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Orçamento total de todas as atividades</p>
                  </TooltipContent>
                </Tooltip>

                {/* Valor Solicitado */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 min-w-[140px]">
                      <CheckCircle2 className="w-4 h-4 text-white dark:text-gray-900" />
                      <span className="text-sm font-semibold text-white dark:text-gray-900">
                        {formatCurrency(subsidy.requested_amount)}
                      </span>
                      <Info className="w-3 h-3 text-gray-300 dark:text-gray-700 ml-auto" />
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
                {activities.map((activity, index) => {
                  const docStatus = getActivityDocumentStatus(activity)
                  return (
                  <button
                    key={activity.id}
                    onClick={() => setSelectedActivityIndex(index)}
                    className={cn(
                      "flex-shrink-0 px-4 py-2.5 rounded-md border text-left transition-all relative",
                      selectedActivityIndex === index
                        ? "border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100"
                        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                    )}
                  >
                    {/* Document Status Badge */}
                    {docStatus !== 'none' && (
                      <div className="absolute -top-1 -right-1">
                        <div className={cn(
                          "w-3 h-3 rounded-full border-2 border-white dark:border-gray-900",
                          docStatus === 'approved' && "bg-green-500",
                          docStatus === 'rejected' && "bg-red-500",
                          docStatus === 'pending' && "bg-amber-500"
                        )} />
                      </div>
                    )}
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
                )})}
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
                  
                  {loadingDocuments || receiptsLoading ? (
                    <div className="py-8 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span>Carregando documentos...</span>
                      </div>
                    </div>
                  ) : currentActivity.documents.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 py-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-md">
                      Nenhum documento anexado
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentActivity.documents.map((doc) => {
                        const validation = documentValidations[doc.id]
                        const isInMentionMode = mentionMode === doc.id
                        
                        return (
                        <div
                          key={doc.id}
                          className={cn(
                            "group p-3 rounded-md transition-all border border-gray-200 dark:border-gray-800",
                            doc.is_validated === true && "bg-green-50/30 dark:bg-green-950/5 border-l-4 border-l-green-500 dark:border-l-green-600",
                            doc.is_validated === false && "bg-red-50/30 dark:bg-red-950/5 border-l-4 border-l-red-500 dark:border-l-red-600",
                            doc.is_validated === undefined && "bg-gray-50 dark:bg-gray-800/50 border-l-4 border-l-amber-400 dark:border-l-amber-600 hover:border-l-amber-500 dark:hover:border-l-amber-500"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className={cn(
                                "w-4 h-4",
                                doc.is_validated === true && "text-green-600 dark:text-green-500",
                                doc.is_validated === false && "text-red-600 dark:text-red-500",
                                doc.is_validated === undefined && "text-amber-600 dark:text-amber-500"
                              )} />
                              <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {doc.file_name}
                                </p>
                                {/* Status Badge Minimalista */}
                                {doc.is_validated === true && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-green-100 dark:bg-green-950/50 border-green-400 text-green-700 dark:text-green-400">
                                    Aprovado
                                  </Badge>
                                )}
                                {doc.is_validated === false && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-100 dark:bg-red-950/50 border-red-400 text-red-700 dark:text-red-400">
                                    Rejeitado
                                  </Badge>
                                )}
                                {doc.is_validated === undefined && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-100 dark:bg-amber-950/50 border-amber-400 text-amber-700 dark:text-amber-400">
                                    Pendente
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={cn(
                                  "text-xs",
                                  doc.is_validated !== undefined && "opacity-60"
                                )}>
                                  {getDocumentTypeLabel(doc.document_type)}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                                <span className={cn(
                                  "text-xs font-medium",
                                  doc.is_validated === true && "text-green-700 dark:text-green-400",
                                  doc.is_validated === false && "text-red-700 dark:text-red-400",
                                  doc.is_validated === undefined && "text-gray-700 dark:text-gray-300"
                                )}>
                                  {formatCurrency(doc.amount)}
                                </span>
                              </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {/* Finance Management Actions - Hidden by default, shown on hover */}
                              <WithPermission requiredPermissions={[PermissionResolverName.Institutions]} partialPermissionCheck>
                                {doc.is_validated === undefined && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleValidateDocument(doc.id, true)}
                                          className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        <p className="text-xs">Aprovar documento</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setMentionMode(doc.id)
                                            setNewMessage("")
                                          }}
                                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        >
                                          <Ban className="w-3.5 h-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        <p className="text-xs">Rejeitar documento</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setCommentingDocument({ id: doc.id, name: doc.file_name })
                                            setNewMessage("")
                                          }}
                                          className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                        >
                                          <MessageCircle className="w-3.5 h-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        <p className="text-xs">Adicionar comentário</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                )}
                              </WithPermission>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownload(doc)}
                                    disabled={doc.is_validated !== undefined}
                                    className={cn(
                                      "h-7 w-7 p-0",
                                      doc.is_validated === undefined 
                                        ? "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                        : "text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed"
                                    )}
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="text-xs">{doc.is_validated !== undefined ? 'Download desabilitado' : 'Download documento'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          
                          {/* Validation note display only */}
                          {doc.validation_note && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-start gap-2 p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                                <AtSign className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-amber-900 dark:text-amber-200">
                                    {doc.validation_note}
                                  </p>
                                  {doc.validated_by && doc.validated_at && (
                                    <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                                      Por {doc.validated_by} em {format(new Date(doc.validated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      )}
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
                    
                    {/* Activity Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Filter className={cn(
                            "h-3 w-3",
                            chatFilterActivity && "text-blue-600 dark:text-blue-400"
                          )} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrar por Atividade</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setChatFilterActivity(null)}>
                          <div className="flex items-center gap-2">
                            {!chatFilterActivity && <Check className="h-3 w-3" />}
                            <span className={!chatFilterActivity ? "font-semibold" : ""}>Todas</span>
                          </div>
                        </DropdownMenuItem>
                        {activities.map(activity => (
                          <DropdownMenuItem key={activity.id} onClick={() => setChatFilterActivity(activity.id)}>
                            <div className="flex items-center gap-2">
                              {chatFilterActivity === activity.id && <Check className="h-3 w-3" />}
                              <span className={chatFilterActivity === activity.id ? "font-semibold" : ""}>
                                {activity.name}
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Active Filter Badge */}
                  {chatFilterActivity && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-300 text-blue-700 dark:text-blue-400">
                        <Filter className="w-3 h-3 mr-1" />
                        {activities.find(a => a.id === chatFilterActivity)?.name}
                        <button onClick={() => setChatFilterActivity(null)} className="ml-1 hover:text-blue-900">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredMessages.map((item, index) => {
                    // Check if this message is related to an activity
                    const relatedActivity = activities.find(act => 
                      item.reason.toLowerCase().includes(act.name.toLowerCase())
                    )
                    const showActivityDivider = relatedActivity && (
                      index === 0 || 
                      !filteredMessages[index - 1]?.reason.toLowerCase().includes(relatedActivity.name.toLowerCase())
                    )

                    // Determinar tipo de mensagem e ícone apropriado
                    const isDocumentValidation = item.reason.includes('validado') || item.reason.includes('aprovado')
                    const isDocumentRejection = item.reason.includes('rejeitado')
                    const isDocumentComment = item.reason.includes('Comentário sobre documento')
                    const isStatusChange = !isDocumentValidation && !isDocumentRejection && !isDocumentComment
                    
                    let MessageIcon = MessageCircle
                    let iconColor = "text-gray-500 dark:text-gray-400"
                    
                    if (isDocumentValidation) {
                      MessageIcon = CheckCircle2
                      iconColor = "text-gray-600 dark:text-gray-400"
                    } else if (isDocumentRejection) {
                      MessageIcon = XCircle
                      iconColor = "text-gray-600 dark:text-gray-400"
                    } else if (isDocumentComment) {
                      MessageIcon = FileText
                      iconColor = "text-gray-600 dark:text-gray-400"
                    } else if (isStatusChange) {
                      MessageIcon = AlertCircle
                      iconColor = "text-gray-600 dark:text-gray-400"
                    }
                    
                    // Check if message can be edited (user's own messages)
                    const canEdit = item.changed_by === "Você" || item.changed_by === "Admin User"

                    return (
                      <React.Fragment key={item.id}>
                        {/* Activity Divider */}
                        {showActivityDivider && relatedActivity && !chatFilterActivity && (
                          <div className="flex items-center gap-3 py-4">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-gray-300 dark:to-gray-600" />
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                              <FileText className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                {relatedActivity.name}
                              </span>
                            </div>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-300 dark:via-gray-600 to-transparent" />
                          </div>
                        )}
                        
                      <div className="group relative">
                        <div className={cn(
                          "flex gap-3",
                          canEdit && "flex-row-reverse"
                        )}>
                          <div className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                            <MessageIcon className={cn("w-3.5 h-3.5", iconColor)} />
                          </div>
                          
                          <div className={cn(
                            "flex-1 pb-3 max-w-[75%]",
                            canEdit && "flex flex-col items-end"
                          )}>
                            <div className={cn(
                              "rounded-lg p-3 mb-2",
                              canEdit 
                                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900" 
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            )}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                  "text-[10px] font-medium",
                                  canEdit 
                                    ? "text-gray-300 dark:text-gray-600" 
                                    : "text-gray-600 dark:text-gray-400"
                                )}>
                                  {isDocumentValidation && 'Documento Aprovado'}
                                  {isDocumentRejection && 'Documento Rejeitado'}
                                  {isDocumentComment && 'Comentário'}
                                  {isStatusChange && 'Atualização de Status'}
                                </span>
                                {item.isNew && (
                                  <Badge variant="default" className="text-[9px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-1.5 py-0">
                                    Nova
                                  </Badge>
                                )}
                              </div>
                              
                              <p className={cn(
                                "text-xs mb-0 leading-relaxed",
                                canEdit 
                                  ? "text-white dark:text-gray-900" 
                                  : "text-gray-700 dark:text-gray-300"
                              )}>
                                {item.reason}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                              <User className="w-3 h-3" />
                              <span>{item.changed_by}</span>
                              <span>•</span>
                              <span>{format(item.changed_at, "dd/MM HH:mm", { locale: ptBR })}</span>
                            </div>
                            
                            {/* Edit/Delete Actions - Only for user's messages */}
                            {canEdit && (
                              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditMessage(item)}
                                      className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                    >
                                      <Pencil className="w-3 h-3 mr-1" />
                                      <span className="text-[10px]">Editar</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">Editar comentário</p>
                                  </TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteMessage(item.id)}
                                      className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      <span className="text-[10px]">Deletar</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">Deletar comentário</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      </React.Fragment>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de Mensagem */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  {/* Mention Labels */}
                  {(mentionStatus || mentionPriority) && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {mentionStatus && (
                        <div className={cn(
                          "flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs font-medium",
                          mentionStatus === 'approved' && "bg-green-50 dark:bg-green-950/30 border-green-400 text-green-700 dark:text-green-400",
                          mentionStatus === 'rejected' && "bg-red-50 dark:bg-red-950/30 border-red-400 text-red-700 dark:text-red-400",
                          mentionStatus === 'in_review' && "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-400",
                          mentionStatus === 'pending' && "bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-700 dark:text-amber-400"
                        )}>
                          <AtSign className="w-3 h-3" />
                          <span>Status: {statusConfig[mentionStatus].label}</span>
                          <button onClick={() => setMentionStatus(null)} className="hover:opacity-70">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {mentionPriority && (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100">
                          <AtSign className="w-3 h-3" />
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            mentionPriority === 'high' && "bg-red-500",
                            mentionPriority === 'medium' && "bg-yellow-500",
                            mentionPriority === 'low' && "bg-green-500"
                          )} />
                          <span>Prioridade: {mentionPriority === 'high' ? 'Alta' : mentionPriority === 'medium' ? 'Média' : 'Baixa'}</span>
                          <button onClick={() => setMentionPriority(null)} className="hover:opacity-70">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Context Banners */}
                  {editingMessage && (
                    <div className="mb-3 p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Pencil className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          <p className="text-xs font-medium text-amber-900 dark:text-amber-200 truncate">
                            Editando comentário
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingMessage(null)
                            setNewMessage("")
                          }}
                          className="h-5 w-5 p-0 text-amber-600 hover:text-amber-700 dark:text-amber-400"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {commentingDocument && (
                    <div className="mb-3 p-2.5 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <p className="text-xs font-medium text-blue-900 dark:text-blue-200 truncate">
                            Comentário: {commentingDocument.name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCommentingDocument(null)
                            setNewMessage("")
                          }}
                          className="h-5 w-5 p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {mentionMode && (
                    <div className="mb-3 p-2.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-700">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Ban className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                          <p className="text-xs font-medium text-red-900 dark:text-red-200 truncate">
                            Rejeitar documento: {activities.flatMap(a => a.documents).find(d => d.id === mentionMode)?.file_name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setMentionMode(null)
                            setNewMessage("")
                          }}
                          className="h-5 w-5 p-0 text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Single Unified Input */}
                  <div className="flex gap-2 items-center">
                    {/* Mention Buttons */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 px-2">
                          <AtSign className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Mencionar</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setMentionStatus(currentSubsidyStatus)}>
                          Status Atual
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMentionPriority(currentPriority)}>
                          Prioridade Atual
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                      ref={chatInputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={
                        editingMessage
                          ? "Edite seu comentário..."
                          : commentingDocument 
                          ? "Digite seu comentário sobre o documento..."
                          : mentionMode 
                          ? "Digite o motivo da rejeição..."
                          : "Adicionar comentário..."
                      }
                      className={cn(
                        "flex-1 h-9 text-xs transition-all",
                        editingMessage && "border-amber-500 dark:border-amber-500 ring-2 ring-amber-200 dark:ring-amber-900",
                        commentingDocument && "border-blue-500 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900",
                        mentionMode && "border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900",
                        !editingMessage && !commentingDocument && !mentionMode && "border-gray-300 dark:border-gray-700"
                      )}
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
