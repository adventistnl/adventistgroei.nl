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
import { UPDATE_SUBSIDY_REQUEST, APPROVE_SUBSIDY_REQUEST, REJECT_SUBSIDY_REQUEST, ADD_SUBSIDY_REQUEST_MESSAGE, UPDATE_SUBSIDY_REQUEST_MESSAGE, DELETE_SUBSIDY_REQUEST_MESSAGE } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"
import { GET_SUBSIDY_STATUS_HISTORY } from "@/graphql/queries/SUBSIDY_STATUS_HISTORY_QUERIES"
import { GET_ALL_SUBSIDY_STATUSES } from "@/graphql/queries/SUBSIDY_STATUS_QUERIES"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  type?: "STATUS_CHANGE" | "PRIORITY_CHANGE" | "COMMENT" | "DOCUMENT_ACTION"
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
  const [mentionStatus, setMentionStatus] = React.useState<"pending" | "in_review" | "approved" | "rejected" | "closed" | null>(null)
  const [mentionPriority, setMentionPriority] = React.useState<"low" | "medium" | "high" | null>(null)
  const chatInputRef = React.useRef<HTMLInputElement>(null)
  const [loadingDocuments, setLoadingDocuments] = React.useState(false)
  const [receipts, setReceipts] = React.useState<SubsidyReceipt[]>([])
  const [subsidyStatuses, setSubsidyStatuses] = React.useState<Array<{id: string, name: string, description: string}>>([])
  
  // Dialog states for replacing browser alerts
  const [deleteCommentDialog, setDeleteCommentDialog] = React.useState<{ isOpen: boolean; messageId: string | null }>({ isOpen: false, messageId: null })
  const [rejectionDialog, setRejectionDialog] = React.useState<{ isOpen: boolean; reason: string }>({ isOpen: false, reason: "" })
  const [statusConfirmationDialog, setStatusConfirmationDialog] = React.useState<{ 
    isOpen: boolean; 
    status: "approved" | "rejected" | "closed" | null; 
    statusId?: string 
  }>({ isOpen: false, status: null })

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
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: subsidy?.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success(t('toasts.statusUpdated'))
      // Trigger callback to refresh data in parent
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      let ext = (error.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (error.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (error.networkError as any).result.errors[0].extensions;
      }
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
          toast.error("O subsídio já está fechado e não pode ser alterado.");
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
          toast.error("Não é possível fechar um subsídio em revisão. É necessário aprovar ou rejeitar primeiro.");
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
          toast.error("Subsídios aprovados ou rejeitados só podem ser fechados.");
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
          toast.error(t('toasts.documentsPending') || "All documents must be validated first");
      } else {
          toast.error(t('toasts.statusUpdateError', { error: error.message }))
      }
      console.error("Error updating subsidy:", error)
    }
  })

  const [approveSubsidyRequest] = useMutation(APPROVE_SUBSIDY_REQUEST, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: subsidy?.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success(t('toasts.subsidyApproved'))
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      let ext = (error.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (error.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (error.networkError as any).result.errors[0].extensions;
      }
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
          toast.error("O subsídio já está fechado e não pode ser alterado.");
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
          toast.error("Não é possível fechar um subsídio em revisão. É necessário aprovar ou rejeitar primeiro.");
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
          toast.error("Subsídios aprovados ou rejeitados só podem ser fechados.");
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
          toast.error(t('toasts.documentsPending') || "All documents must be validated first");
      } else {
          toast.error(t('toasts.approveError', { error: error.message }))
      }
      console.error("Error approving subsidy:", error)
    }
  })

  const [rejectSubsidyRequest] = useMutation(REJECT_SUBSIDY_REQUEST, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: subsidy?.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success(t('toasts.subsidyRejected'))
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      let ext = (error.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (error.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (error.networkError as any).result.errors[0].extensions;
      }
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
          toast.error("O subsídio já está fechado e não pode ser alterado.");
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
          toast.error("Não é possível fechar um subsídio em revisão. É necessário aprovar ou rejeitar primeiro.");
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
          toast.error("Subsídios aprovados ou rejeitados só podem ser fechados.");
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
          toast.error(t('toasts.documentsPending') || "All documents must be validated first");
      } else {
          toast.error(t('toasts.rejectError', { error: error.message }))
      }
      console.error("Error rejecting subsidy:", error)
    }
  })

  const [addSubsidyRequestMessage] = useMutation(ADD_SUBSIDY_REQUEST_MESSAGE, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: subsidy?.id } }],
    onError: (error) => {
      console.error("Error adding message:", error)
      toast.error(t('toasts.messageSentError'))
    }
  })

  const [updateSubsidyRequestMessage] = useMutation(UPDATE_SUBSIDY_REQUEST_MESSAGE, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: subsidy?.id } }],
    onError: (error) => {
      console.error("Error updating message:", error)
      toast.error(t('toasts.messageUpdateError'))
    }
  })

  const [deleteSubsidyRequestMessage] = useMutation(DELETE_SUBSIDY_REQUEST_MESSAGE, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: subsidy?.id } }],
    onError: (error) => {
      console.error("Error deleting message:", error)
      toast.error(t('toasts.messageDeleteError'))
    }
  })

  // Fetch subsidy statuses
  const { data: statusesData } = useQuery(GET_ALL_SUBSIDY_STATUSES, {
    onCompleted: (data) => {
      if (data?.subsidyStatuses) {
        setSubsidyStatuses(data.subsidyStatuses)
      }
    },
    onError: (error) => {
      console.error('Error fetching subsidy statuses:', error)
    }
  })

  // Helper function to get status ID by name
  const getStatusIdByName = (statusName: string): string | null => {
    const status = subsidyStatuses.find(s => s.name === statusName)
    return status?.id || null
  }

  // Validate status transition
  const canChangeStatus = (to: string) => {
    const from = currentSubsidyStatus

    // Rule: Closed status cannot be changed to anything else
    if (from === 'closed') return false
    
    // Rule: To Closed is allowed from Approved or Rejected only (not In Review)
    if (to === 'closed') {
      if (from === 'in_review') return false
      // Only allowed from approved or rejected
      return from === 'approved' || from === 'rejected'
    }
    
    // Rule: If Approved or Rejected, can ONLY go to Closed
    if (from === 'approved' || from === 'rejected') {
      return to === 'closed'
    }
    
    return true
  }

  // Handle status change request
  const handleStatusChangeRequest = (statusName: string) => {
    const normalizedStatus = statusName.toLowerCase()
    
    // Check validation first
    if (!canChangeStatus(normalizedStatus)) {
        toast.error(t('toasts.statusChangeNotAllowed'))
        return
    }

    // Check document validation
    if (['approved', 'closed', 'rejected'].includes(normalizedStatus)) {
        const hasPending = (receipts || []).some((r: any) => !r.is_validated && !r.is_deleted);
        if (hasPending) {
             toast.error(t('toasts.documentsPending') || "All documents must be validated first");
             return;
        }
    }

    // For Rejected, we have a specific dialog with reason input
    if (normalizedStatus === 'rejected') {
      setRejectionDialog({ isOpen: true, reason: "" })
      return
    }

    // For Approved or Closed, we show the confirmation dialog
    if (normalizedStatus === 'approved' || normalizedStatus === 'closed') {
      setStatusConfirmationDialog({
        isOpen: true,
        status: normalizedStatus as any,
        statusId: getStatusIdByName(statusName.toUpperCase()) || undefined
      })
      return
    }
    
    // For other statuses (Pending, In Review), execute immediately
    executeStatusChange(normalizedStatus)
  }

  // Execute status change after confirmation
  const confirmStatusChangeAction = async () => {
    const { status, statusId } = statusConfirmationDialog
    if (!status) return

    try {
      if (status === 'approved') {
        setCurrentSubsidyStatus('approved')
        setMentionStatus('approved')
        setNewMessage(t('subsidy.statusChangePrefix', { status: t('charts.legend.accepted') }))
        
        await approveSubsidyRequest({
          variables: {
            id: subsidy.id,
            approved_amount: subsidy.requested_amount
          }
        })
      } else if (status === 'closed') {
        const id = statusId || getStatusIdByName('CLOSED')
        if (id) {
           setCurrentSubsidyStatus('closed')
           setMentionStatus('closed')
           setNewMessage(t('subsidy.statusChangePrefix', { status: t('charts.legend.closed') }))
           
           await updateSubsidyRequest({
             variables: {
               id: subsidy.id,
               data: { subsidy_status_id: id }
             }
           })
        }
      }
    } catch (error) {
      console.error(`Error changing status to ${status}:`, error)
    }
    setStatusConfirmationDialog({ isOpen: false, status: null })
  }

  // Helper to execute immediate status changes
  const executeStatusChange = async (status: string) => {
     const statusId = getStatusIdByName(status.toUpperCase())
     if (!statusId) {
       toast.error(t('filters.status') + ' ' + t('common.notFound'))
       return
     }
     
     setCurrentSubsidyStatus(status as any)
     setMentionStatus(status as any)
     setNewMessage(t('subsidy.statusChangePrefix', { status: t(`filters.${status}`) || status }))
     chatInputRef.current?.focus()
     
     try {
       await updateSubsidyRequest({
         variables: {
           id: subsidy.id,
           data: { subsidy_status_id: statusId }
         }
       })
     } catch (error) {
       console.error('Error updating status:', error)
     }
  }
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
          toast.error(t('toasts.documentsLoadError'))
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
      variables: {
        subsidyRequestId: subsidy?.id
      },
      skip: !subsidy?.id,
    }
  )

  // Mutations


  // Transform history data from backend to UI format
  const statusHistory = React.useMemo<StatusHistoryItem[]>(() => {
    if (!historyData?.getSubsidyStatusHistory) return []
    
    return historyData.getSubsidyStatusHistory.map((item: any) => ({
      id: item.id,
      status: item.status.name.toLowerCase(),
      type: item.type,
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    // Handle editing existing message
    if (editingMessage) {
      try {
        await updateSubsidyRequestMessage({
          variables: {
            id: editingMessage,
            message: newMessage
          }
        })
        toast.success(t('toasts.commentUpdated'))
        setEditingMessage(null)
        setNewMessage("")
      } catch (error) {
        // Error handled in useMutation
      }
      return
    }

    // Handle document comment
    if (commentingDocument) {
      const message: StatusHistoryItem = {
        id: `msg-${Date.now()}`,
        status: "in_review",
        reason: `${t('toasts.documentCommentPrefix', { name: commentingDocument.name })}${newMessage}`,
        changed_by: "Admin User",
        changed_at: new Date(),
        isNew: false
      }
      setMessages(prev => [...prev, message])
      toast.success(t('toasts.commentAdded'))
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
    const sendAsyncMessage = async () => {
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
      
      try {
        await addSubsidyRequestMessage({
          variables: {
            id: subsidy?.id,
            message: messageText
          }
        })
        
        
        setNewMessage("")
        setMentionStatus(null)
        setMentionPriority(null)
        toast.success(t('subsidy.messageSent'))
      } catch (error) {
        console.error('Error sending message:', error)
        toast.error(t('toasts.messageSentError'))
      }
    }

    sendAsyncMessage()
  }

  const handleDeleteMessage = async (messageId: string) => {
    setDeleteCommentDialog({ isOpen: true, messageId })
  }

  const confirmDeleteMessage = async () => {
    if (!deleteCommentDialog.messageId) return

    try {
      await deleteSubsidyRequestMessage({
        variables: { id: deleteCommentDialog.messageId }
      })
      toast.success(t('subsidy.commentDeleted'))
      setDeleteCommentDialog({ isOpen: false, messageId: null })
    } catch (error) {
      // Error handled in useMutation
    }
  }

  const confirmRejection = async () => {
    if (!rejectionDialog.reason) {
      toast.error(t('subsidy.addRejectionReason'))
      return
    }

    setNewMessage(t('subsidy.statusChangeReasonPrefix', { status: t('charts.legend.rejected'), reason: rejectionDialog.reason }))
    chatInputRef.current?.focus()
    
    // Reject subsidy
    try {
      await rejectSubsidyRequest({
        variables: {
          id: subsidy.id,
          rejection_reason: rejectionDialog.reason
        }
      })
      setRejectionDialog({ isOpen: false, reason: "" })
    } catch (error) {
      console.error('Error rejecting subsidy:', error)
    }
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
          reason: t('subsidy.documentValidated'),
          changed_by: "Admin User",
          changed_at: new Date(),
          isNew: false
        }
        setMessages(prev => [...prev, approvalMessage])
        
        toast.success(t('subsidy.documentValidated'))
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
        toast.error(t('subsidy.addRejectionReason'))
        return
      }
      
      // Call API to reject document
      try {
        await rejectReceipt(docId, newMessage)
        
        // Adicionar mensagem ao histórico com motivo da rejeição
        const rejectionMessage: StatusHistoryItem = {
          id: `msg-${Date.now()}`,
          status: "rejected",
          reason: `${t('subsidy.documentRejected')}: ${newMessage}`,
          changed_by: "Admin User",
          changed_at: new Date(),
          isNew: false
        }
        setMessages(prev => [...prev, rejectionMessage])
        
        toast.success(t('subsidy.documentRejected'))
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
      label: t('filters.pending'),
      icon: Clock,
      className: "text-yellow-500"
    },
    approved: { 
      label: t('charts.legend.accepted'),
      icon: CheckCircle2,
      className: "text-green-600"
    },
    rejected: { 
      label: t('charts.legend.rejected'),
      icon: XCircle,
      className: "text-red-600"
    },
    in_review: { 
      label: t('charts.legend.inReview'),
      icon: AlertCircle,
      className: "text-blue-500"
    },
    closed: {
      label: t('subsidy.closed'),
      icon: Ban,
      className: "text-gray-500"
    }
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
    const typeKey = type as keyof typeof t
    return t(`subsidy.documentTypes.${type}` as any) || type
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
                    {t('subsidy.requestedOn')} {format(new Date(subsidy.requested_at), "dd/MM/yyyy")}
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
                    <DropdownMenuLabel>{t('subsidy.changeStatus')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => handleStatusChangeRequest('PENDING')}
                        disabled={!canChangeStatus('pending')}
                    >
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      {t('filters.pending')}
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        onClick={() => handleStatusChangeRequest('IN_REVIEW')}
                        disabled={!canChangeStatus('in_review')}
                    >
                      <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                      {t('charts.legend.inReview')}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                        onClick={() => handleStatusChangeRequest('APPROVED')}
                         disabled={!canChangeStatus('approved')}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      {t('charts.legend.accepted')}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                        onClick={() => handleStatusChangeRequest('REJECTED')}
                        disabled={!canChangeStatus('rejected')}
                    >
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      {t('charts.legend.rejected')}
                    </DropdownMenuItem>

                     <DropdownMenuItem 
                        onClick={() => handleStatusChangeRequest('CLOSED')}
                        disabled={!canChangeStatus('closed')}
                    >
                      <Ban className="mr-2 h-4 w-4 text-gray-500" />
                      {t('subsidy.closed')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Priority Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 hover:bg-transparent"
                        disabled={currentSubsidyStatus === 'closed'}
                    >
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 cursor-pointer min-w-[140px] justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            currentPriority === 'high' && "bg-red-500",
                            currentPriority === 'medium' && "bg-yellow-500",
                            currentPriority === 'low' && "bg-green-500"
                          )} />
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {currentPriority === 'high' && t('subsidy.priority.high')}
                            {currentPriority === 'medium' && t('subsidy.priority.medium')}
                            {currentPriority === 'low' && t('subsidy.priority.low')}
                          </span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-500" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>{t('subsidy.priority.change')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={async () => {
                      setCurrentPriority('high')
                      setMentionPriority('high')
                      setNewMessage(t('subsidy.priority.changedTo', { priority: t('subsidy.priority.high') }))
                      chatInputRef.current?.focus()
                      try {
                        await updateSubsidyRequest({
                          variables: {
                            id: subsidy.id,
                            data: { priority: 'HIGH' }
                          }
                        })
                        toast.success(t('subsidy.priority.changedTo', { priority: t('subsidy.priority.high') }))
                        onSubsidyUpdated?.()
                      } catch (error) {
                        toast.error(t('subsidy.priority.error'))
                      }
                    }}>
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      {t('subsidy.priority.high')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                      setCurrentPriority('medium')
                      setMentionPriority('medium')
                      setNewMessage(t('subsidy.priority.changedTo', { priority: t('subsidy.priority.medium') }))
                      chatInputRef.current?.focus()
                      try {
                        await updateSubsidyRequest({
                          variables: {
                            id: subsidy.id,
                            data: { priority: 'MEDIUM' }
                          }
                        })
                        toast.success(t('subsidy.priority.changedTo', { priority: t('subsidy.priority.medium') }))
                        onSubsidyUpdated?.()
                      } catch (error) {
                        toast.error(t('subsidy.priority.error'))
                      }
                    }}>
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                      {t('subsidy.priority.medium')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                      setCurrentPriority('low')
                      setMentionPriority('low')
                      setNewMessage(t('subsidy.priority.changedTo', { priority: t('subsidy.priority.low') }))
                      chatInputRef.current?.focus()
                      try {
                        await updateSubsidyRequest({
                          variables: {
                            id: subsidy.id,
                            data: { priority: 'LOW' }
                          }
                        })
                        toast.success(t('subsidy.priority.changedTo', { priority: t('subsidy.priority.low') }))
                        onSubsidyUpdated?.()
                      } catch (error) {
                        toast.error(t('subsidy.priority.error'))
                      }
                    }}>
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      {t('subsidy.priority.low')}
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
                {t('subsidy.activities')}
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
                    {currentActivity.documents.length} {t('subsidy.documents').toLowerCase()}
                  </Badge>
                </div>

                {/* Activity Values */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('table.budget')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(currentActivity.budget_amount)}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('charts.subsidyActivity.totalRequested')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(currentActivity.requested_amount)}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t('subsidy.documents')}
                  </h5>
                  
                  {loadingDocuments || receiptsLoading ? (
                      <div className="py-8 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span>{t('subsidy.loadingDocuments')}</span>
                      </div>
                    </div>
                  ) : currentActivity.documents.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 py-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-md">
                      {t('subsidy.noDocuments')}
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
                                    {t('charts.legend.accepted')}
                                  </Badge>
                                )}
                                {doc.is_validated === false && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-100 dark:bg-red-950/50 border-red-400 text-red-700 dark:text-red-400">
                                    {t('charts.legend.rejected')}
                                  </Badge>
                                )}
                                {doc.is_validated === undefined && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-100 dark:bg-amber-950/50 border-amber-400 text-amber-700 dark:text-amber-400">
                                    {t('filters.pending')}
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
                                {doc.is_validated === undefined && currentSubsidyStatus !== 'closed' && (
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
                                        <p className="text-xs">{t('subsidy.approveDocument')}</p>
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
                                        <p className="text-xs">{t('subsidy.rejectDocument')}</p>
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
                                        <p className="text-xs">{t('subsidy.addComment')}</p>
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
                                  <p className="text-xs">{doc.is_validated !== undefined ? t('subsidy.downloadDisabled') : t('subsidy.downloadDocument')}</p>
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
                                      {t('subsidy.validatedBy', { user: doc.validated_by, date: format(new Date(doc.validated_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )})}

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
                        {t('subsidy.history')}
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
                        <DropdownMenuLabel>{t('subsidy.filterByActivity')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setChatFilterActivity(null)}>
                          <div className="flex items-center gap-2">
                            {!chatFilterActivity && <Check className="h-3 w-3" />}
                            <span className={!chatFilterActivity ? "font-semibold" : ""}>{t('subsidy.all')}</span>
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
                                  {isDocumentValidation && t('subsidy.documentApproved')}
                                  {isDocumentRejection && t('subsidy.documentRejected')}
                                  {isDocumentComment && t('subsidy.documentComment')}
                                  {isStatusChange && t('subsidy.statusUpdate')}
                                </span>
                                {item.isNew && (
                                  <Badge variant="default" className="text-[9px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-1.5 py-0">
                                    {t('subsidy.newBadge')}
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
                            {canEdit && currentSubsidyStatus !== 'closed' && (
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
                                      <span className="text-[10px]">{t('actions.edit')}</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">{t('subsidy.editComment')}</p>
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
                                      <span className="text-[10px]">{t('actions.delete')}</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">{t('subsidy.deleteComment')}</p>
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
                          <span>{t('filters.priority')}: {mentionPriority === 'high' ? t('subsidy.priority.high') : mentionPriority === 'medium' ? t('subsidy.priority.medium') : t('subsidy.priority.low')}</span>
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
                            {t('subsidy.editingComment')}
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
                            {t('subsidy.commentOn')}{commentingDocument.name}
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
                            {t('subsidy.rejectingDocument')}: {activities.flatMap(a => a.documents).find(d => d.id === mentionMode)?.file_name}
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
                      <DropdownMenuTrigger asChild disabled={currentSubsidyStatus === 'closed'}>
                        <Button variant="outline" size="sm" className="h-9 px-2">
                          <AtSign className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>{t('subsidy.mention')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setMentionStatus(currentSubsidyStatus)}>
                          {t('subsidy.currentStatus')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMentionPriority(currentPriority)}>
                          {t('subsidy.currentPriority')}
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
                          ? t('subsidy.placeholders.editComment')
                          : commentingDocument 
                          ? t('subsidy.placeholders.documentComment')
                          : mentionMode 
                          ? t('subsidy.placeholders.rejectReason')
                          : t('subsidy.placeholders.addComment')
                      }
                      disabled={currentSubsidyStatus === 'closed'}
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
                      disabled={!newMessage.trim() || currentSubsidyStatus === 'closed'}
                      size="sm"
                      className="h-9 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 disabled:opacity-50"
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
              {t('subsidy.close')}
            </Button>
          </div>
        </div>
      </div>
      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={deleteCommentDialog.isOpen}
        onClose={() => setDeleteCommentDialog({ isOpen: false, messageId: null })}
        onConfirm={confirmDeleteMessage}
        title={t('subsidy.deleteCommentTitle') || 'Excluir Comentário'}
        description={t('subsidy.deleteCommentConfirm') || 'Tem certeza que deseja excluir este comentário?'}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        severity="high"
      />

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog.isOpen} onOpenChange={(open) => !open && setRejectionDialog({ isOpen: false, reason: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                {t('subsidy.rejectTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('subsidy.reasonRejection')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2 text-justify">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {t('subsidy.statusChange.warning.rejected')}
                </p>
            </div>
            <Textarea
              value={rejectionDialog.reason}
              onChange={(e) => setRejectionDialog(prev => ({ ...prev, reason: e.target.value }))}
              placeholder={t('subsidy.placeholders.rejectReason')}
              className="resize-none"
              rows={4}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setRejectionDialog({ isOpen: false, reason: "" })} className="w-full sm:w-auto">
              {t('common.cancel')}
            </Button>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
                <Button variant="destructive" onClick={confirmRejection} className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                {t('common.reject')}
                </Button>
                <p className="text-xs text-center text-red-600">
                    {t('common.riskAware')}
                </p>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Status Confirmation Dialog */}
       <ConfirmationDialog
        isOpen={statusConfirmationDialog.isOpen}
        onClose={() => setStatusConfirmationDialog({ isOpen: false, status: null })}
        onConfirm={confirmStatusChangeAction}
        title={t('subsidy.statusChange.title')}
        description={
            statusConfirmationDialog.status === 'approved' 
            ? t('subsidy.statusChange.warning.approved')
            : statusConfirmationDialog.status === 'closed'
                ? t('subsidy.statusChange.warning.closed')
                : t('subsidy.statusChange.warning.generic')
        }
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        severity="high"
        warnings={[
            {
                icon: AlertCircle,
                text: t('subsidy.irreversibleActionWarning')
            }
        ]}
      />
    </div>
  )
}
