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
import { useAuth } from "@/contexts/auth-context"
import { useInstitution } from "@/contexts/institution-context"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SubsidyRequestCardData } from "@/components/projects/subsidy-request-card"
import { AdvanceSubsidyBadge } from "@/components/ui/advance-subsidy-badge"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { useSubsidyReceipts, SubsidyReceipt } from "@/hooks/use-subsidy-receipts"
import { useMutation, useQuery } from "@apollo/client"
import { UPDATE_SUBSIDY_REQUEST, APPROVE_SUBSIDY_REQUEST, REJECT_SUBSIDY_REQUEST, ADD_SUBSIDY_REQUEST_MESSAGE, UPDATE_SUBSIDY_REQUEST_MESSAGE, DELETE_SUBSIDY_REQUEST_MESSAGE } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"
import { CONFIRM_REFUND_DONE } from "@/graphql/mutations/REFUND_MUTATIONS"
import { GET_SUBSIDY_STATUS_HISTORY } from "@/graphql/queries/SUBSIDY_STATUS_HISTORY_QUERIES"
import { GET_ALL_SUBSIDY_STATUSES } from "@/graphql/queries/SUBSIDY_STATUS_QUERIES"
import { GET_SUBSIDY_REQUEST_BY_ID } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { RejectionDialog } from "@/components/modals/project/rejection-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { projectTranslations } from "@/lib/translations/projects"
import { SubsidyChatPanel } from "@/components/modals/project/subsidy-chat-panel"
import { RequestRefundModal } from "@/components/modals/project/request-refund-modal"
import { ConfirmRefundDoneModal } from "@/components/modals/confirm-refund-done-modal"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"

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
  user_id: string
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

/**
 * VIEW SUBSIDY MODAL
 * 
 * DATA SOURCES:
 * 1. Prop (subsidy) - Receives pre-computed data from manager:
 *    - Basic subsidy info (title, amounts, status, etc.)
 *    - Computed responsibleUsers (requester, project owner, leader, finance)
 *    - Institution/department relationships
 * 
 * 2. GET_SUBSIDY_REQUEST_BY_ID - Fetches real-time updates:
 *    - Fresh status/refund fields (lightweight - NO institution.users)
 *    - Receipt documents
 *    - Detailed validation state
 * 
 * 3. InstitutionContext - User data source:
 *    - currentInstitutionData.users for computing responsible users
 *    - Avoids fetching 500+ users in modal query
 *    - Single source of truth for user data
 * 
 * 4. GET_SUBSIDY_STATUS_HISTORY - Status change log
 * 
 * PERFORMANCE NOTES:
 * - Prop data comes from page's GET_ALL_SUBSIDY_REQUESTS (already fetched)
 * - Modal query ensures real-time accuracy without duplicate base data
 * - responsibleUsers computed from InstitutionContext (not query)
 * - ~70-90% smaller query payload compared to previous version
 */

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

  // Subsidy prop received - no debug logs in production

  const { formatCurrency } = useCurrency()
  const { user } = useAuth()
  const { currentInstitutionData } = useInstitution()
  const { t, i18n } = useTranslation()

  // Helper para acessar traduções do modal
  const modalT = React.useMemo(() => {
    const lang = i18n.language as keyof typeof projectTranslations
    return projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal
  }, [i18n.language])

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
  const [currentSubsidyStatus, setCurrentSubsidyStatus] = React.useState<"pending" | "in_review" | "approved" | "rejected" | "closed" | "advanced_closed" | "waiting_refund">(subsidy?.status || "pending")
  const [currentPriority, setCurrentPriority] = React.useState<"low" | "medium" | "high">("medium")
  const [mentionStatus, setMentionStatus] = React.useState<"pending" | "in_review" | "approved" | "rejected" | "closed" | "advanced_closed" | "waiting_refund" | null>(null)
  const [mentionPriority, setMentionPriority] = React.useState<"low" | "medium" | "high" | null>(null)
  const chatInputRef = React.useRef<HTMLInputElement>(null)
  const [loadingDocuments, setLoadingDocuments] = React.useState(false)
  const [receipts, setReceipts] = React.useState<SubsidyReceipt[]>([])
  const [subsidyStatuses, setSubsidyStatuses] = React.useState<Array<{ id: string, name: string, description: string }>>([])
  const [lastStatusUpdateError, setLastStatusUpdateError] = React.useState<string | null>(null)
  const [previousStatus, setPreviousStatus] = React.useState<string>(subsidy?.status || "pending")

  // Dialog states for replacing browser alerts
  const [deleteCommentDialog, setDeleteCommentDialog] = React.useState<{ isOpen: boolean; messageId: string | null }>({ isOpen: false, messageId: null })
  const [rejectionDialog, setRejectionDialog] = React.useState<{ isOpen: boolean }>({ isOpen: false })
  const [statusConfirmationDialog, setStatusConfirmationDialog] = React.useState<{
    isOpen: boolean;
    status: "approved" | "rejected" | "closed" | "advanced_closed" | null;
    statusId?: string
  }>({ isOpen: false, status: null })

  // Refund modal state
  const [showRequestRefundModal, setShowRequestRefundModal] = React.useState(false)
  const [showConfirmRefundModal, setShowConfirmRefundModal] = React.useState(false)

  // Fetch ALL departments from system for internal use
  const { data: allDepartmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    fetchPolicy: 'network-only',
  })

  // Fetch updated subsidy data directly to ensure fresh state (especially for refund buttons/tags)
  const { data: subsidyData, refetch: refetchSubsidyDetails } = useQuery(GET_SUBSIDY_REQUEST_BY_ID, {
    variables: { id: subsidy.id },
    fetchPolicy: 'network-only',
    skip: !subsidy.id,
  })

  // Fetch subsidy statuses (needed for auto-correction useEffect)
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

  // Use fetched data if available, otherwise use prop
  // We need to map the backend data to SubsidyRequestCardData structure if it differs slightly,
  // but for the fields we care about (status, refund fields), the backend structure in GET_SUBSIDY_REQUEST_BY_ID
  // matches what we need for the checks.
  // We'll overlay the fresh fields onto the prop subsidy to keep the structure consistent.
  const activeSubsidy = React.useMemo(() => {
    if (!subsidyData?.subsidyRequest) return subsidy

    const fresh = subsidyData.subsidyRequest
    return {
      ...subsidy,
      status: fresh.subsidy_status?.name?.toLowerCase() || subsidy.status,
      have_refund: fresh.have_refund,
      refund_done: fresh.refund_done,
      refund_amount: fresh.refund_amount,
      // Note: refund_reason does not exist in backend schema
    }
  }, [subsidy, subsidyData])

  /**
   * Compute responsible users for this subsidy:
   * 1. Requester (user who created the request)
   * 2. Project Owner (from project.owner_id)
   * 3. Department leader
   * 4. Finance users from institution (filtered by FINANCE roles)
   * 
   * DATA SOURCE: InstitutionContext.currentInstitutionData.users (all users with roles)
   */
  const responsibleUsers = React.useMemo<UserAvatarData[]>(() => {
    const users: UserAvatarData[] = []
    
    // Get ALL institution users from context (NOT from query - performance optimization)
    const subsidyDepartment = subsidyData?.subsidyRequest?.department
    const subsidyProject = subsidyData?.subsidyRequest?.project
    const institutionUsers = currentInstitutionData?.users || []
    const activeUsers = institutionUsers.filter((u: any) => !u.is_deleted)
    
    // 1. Add REQUESTER (user who created the subsidy request) - find by created_by ID
    const requesterId = subsidyData?.subsidyRequest?.created_by
    const requester = requesterId ? activeUsers.find((u: any) => u.id === requesterId) : null
    
    if (requester) {
      users.push({
        id: requester.id,
        name: requester.name,
        email: requester.email || '',
        role: t('subsidy.roles.requester') || 'Solicitante',
        isOwner: false // Requester is NOT the owner
      })
    }
    
    // 2. Add PROJECT OWNER (from project.owner_id) - PRIMARY RESPONSIBLE & OWNER
    const projectOwner = subsidyProject?.owner
    if (projectOwner) {
      const isDuplicate = users.some(u => u.id === projectOwner.id)
      if (!isDuplicate) {
        users.push({
          id: projectOwner.id,
          name: projectOwner.name,
          email: projectOwner.email || '',
          role: t('subsidy.roles.projectOwner') || 'Dono do Projeto',
          isOwner: true // Project Owner is the OWNER
        })
      }
    }
    
    // 3. Add DEPARTMENT LEADER (must approve)
    let leader = subsidyDepartment?.leader || activeUsers.find((u: any) => u.id === subsidyDepartment?.leader_id)
    
    if (leader) {
      // Avoid duplicate if requester is also leader
      if (!users.some(u => u.id === leader.id)) {
        users.push({
          id: leader.id,
          name: leader.name,
          email: leader.email || '',
          role: t('subsidy.roles.departmentLeader') || 'Líder do Departamento',
        })
      }
    }
    
    // 4. Add FINANCE USERS from institution (users with FINANCIAL_MANAGER role)
    const financeRoleKeys = ['FINANCE_MANAGER', 'FINANCE_ADMIN', 'FINANCIAL_MANAGER', 'CFO', 'FINANCIAL_OFFICER', 'FINANCE']
    
    const financeUsers = activeUsers.filter((u: any) => 
      u.user_roles?.some((ur: any) => 
        financeRoleKeys.includes(ur.role?.key_code?.toUpperCase() || '')
      )
    )
    
    financeUsers.forEach((financeUser: any) => {
      // Avoid duplicates (requester/leader might also be finance)
      if (!users.some(u => u.id === financeUser.id)) {
        users.push({
          id: financeUser.id,
          name: financeUser.name,
          email: financeUser.email || '',
          role: t('subsidy.roles.financeManager') || 'Gestor Financeiro'
        })
      }
    })
    
    return users
  }, [subsidyData, currentInstitutionData, t])

  // 🔍 DEBUG: Log responsible users computation
  React.useEffect(() => {
    console.log('[DEBUG] ViewSubsidyModal Responsible Users:', {
      subsidyId: activeSubsidy?.id,
      responsibleUsersCount: responsibleUsers.length,
      ownerId: responsibleUsers.find(u => u.isOwner)?.id,
      ownerName: responsibleUsers.find(u => u.isOwner)?.name,
      ownerRole: responsibleUsers.find(u => u.isOwner)?.role,
      requesterId: subsidyData?.subsidyRequest?.created_by,
      projectOwnerId: subsidyData?.subsidyRequest?.project?.owner?.id,
      projectOwnerName: subsidyData?.subsidyRequest?.project?.owner?.name,
      allUsers: responsibleUsers.map(u => ({ id: u.id, name: u.name, role: u.role, isOwner: u.isOwner }))
    })
  }, [responsibleUsers, activeSubsidy?.id, subsidyData])

  /**
   * Permission Checks for Document Validation
   * 
   * RULES:
   * 1. Department Leader: Can validate/reject documents ✅
   * 2. Finance Users: Can ONLY comment (not validate/reject) 💬
   * 3. Requester: Can ONLY comment 💬
   * 4. Project Owner: Can ONLY comment 💬
   */
  const canValidateDocuments = React.useMemo(() => {
    if (!user?.id) return false
    
    // Check if current user is the department leader
    const subsidyDepartment = subsidyData?.subsidyRequest?.department
    const leaderId = subsidyDepartment?.leader?.id || subsidyDepartment?.leader_id
    
    const isDepartmentLeader = user.id === leaderId
    
    // 🔍 DEBUG: Log permission check
    console.log('[DEBUG] Document Validation Permission:', {
      userId: user.id,
      userName: user.name,
      leaderId,
      isDepartmentLeader,
      canValidate: isDepartmentLeader
    })
    
    return isDepartmentLeader
  }, [user?.id, subsidyData])

  const isRequester = React.useMemo(() => {
    return user?.id === subsidyData?.subsidyRequest?.created_by
  }, [user?.id, subsidyData])

  const isFinanceUser = React.useMemo(() => {
    const financeRoleKeys = ['FINANCE_MANAGER', 'FINANCE_ADMIN', 'FINANCIAL_MANAGER', 'CFO', 'FINANCIAL_OFFICER', 'FINANCE']
    const institutionUsers = currentInstitutionData?.users || []
    const currentUser = institutionUsers.find((u: any) => u.id === user?.id)
    
    return currentUser?.user_roles?.some((ur: any) => 
      financeRoleKeys.includes(ur.role?.key_code?.toUpperCase() || '')
    ) || false
  }, [user?.id, currentInstitutionData])

  const canEditStatus = React.useMemo(() => {
    // If refund is pending, ALWAYS allow status editing (bypass permission checks)
    if (activeSubsidy.have_refund && !activeSubsidy.refund_done) {
      return true
    }
    
    // Normal rule: Only Department Leader OR Finance User can edit status
    return canValidateDocuments || isFinanceUser
  }, [canValidateDocuments, isFinanceUser, activeSubsidy])

  // 🔍 DEBUG: Log all permission checks
  React.useEffect(() => {
    console.log('[DEBUG] ViewSubsidyModal Permissions:', {
      userId: user?.id,
      userName: user?.name,
      isRequester,
      isFinanceUser,
      canValidateDocuments: canValidateDocuments,
      canEditStatus,
      roles: {
        requester: isRequester ? '✅ Can only comment' : '❌',
        finance: isFinanceUser ? '✅ Can edit status, only comment on docs' : '❌',
        departmentLeader: canValidateDocuments ? '✅ Can validate/reject docs + edit status' : '❌',
      }
    })
  }, [user?.id, user?.name, isRequester, isFinanceUser, canValidateDocuments, canEditStatus])

  /* 
   * Sync local status state when activeSubsidy changes
   */
  React.useEffect(() => {
    if (activeSubsidy?.status) {
      setCurrentSubsidyStatus(activeSubsidy.status as any)
    }
  }, [activeSubsidy])

  // Hook for fetching and managing subsidy receipts
  const {
    fetchReceipts,
    validateReceipt,
    rejectReceipt,
    downloadReceipt,
    loading: receiptsLoading,
    validating: receiptsValidating,
  } = useSubsidyReceipts({
    subsidyRequestId: activeSubsidy?.id,
    onHistoryUpdate: async () => {
      // Refresh everything when a document action happens
      await refetchHistory()
    },
  })

  // Mutations for updating subsidy status
  const [updateSubsidyRequest] = useMutation(UPDATE_SUBSIDY_REQUEST, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: activeSubsidy?.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal
      toast.success(modalT.success.statusUpdated)
      // Trigger callback to refresh data in parent AND locally
      refetchSubsidyDetails()
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      let ext = (error.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (error.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (error.networkError as any).result.errors[0].extensions;
      }
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal;
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
        toast.error(modalT.errors.statusClosed);
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
        toast.error(modalT.errors.cannotCloseInReview);
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
        toast.error(modalT.errors.onlyClosedFromFinalState);
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
        toast.error(modalT.errors.documentsPending);
      } else if (errorCode === 'ONLY_FINANCIAL_CAN_CLOSE') {
        toast.error(modalT.errors.onlyFinancialCanClose);
      } else {
        toast.error(modalT.errorMessages.statusUpdate.replace('{{error}}', error.message))
      }
      console.error("Error updating subsidy:", error)
    }
  })

  const [approveSubsidyRequest] = useMutation(APPROVE_SUBSIDY_REQUEST, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: activeSubsidy?.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal
      toast.success(modalT.success.subsidyApproved)
      refetchSubsidyDetails()
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      // ... error handling logic (keep same)
      let ext = (error.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (error.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (error.networkError as any).result.errors[0].extensions;
      }
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal;
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
        toast.error(modalT.errors.statusClosed);
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
        toast.error(modalT.errors.cannotCloseInReview);
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
        toast.error(modalT.errors.onlyClosedFromFinalState);
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
        toast.error(modalT.errors.documentsPending);
      } else if (errorCode === 'DOCUMENTS_REJECTED') {
        toast.error(modalT.errors.documentsRejected);
      } else if (errorCode === 'ONLY_FINANCIAL_CAN_CLOSE') {
        toast.error(modalT.errors.onlyFinancialCanClose);
      } else {
        toast.error(modalT.errorMessages.approve.replace('{{error}}', error.message))
      }
      console.error("Error approving subsidy:", error)
    }
  })

  // ... other mutations
  const [rejectSubsidyRequest] = useMutation(REJECT_SUBSIDY_REQUEST, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: activeSubsidy?.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal
      toast.success(modalT.success.subsidyRejected)
      refetchSubsidyDetails()
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      // ... error handling logic
      let ext = (error.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (error.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (error.networkError as any).result.errors[0].extensions;
      }
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal;
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
        toast.error(modalT.errors.statusClosed);
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
        toast.error(modalT.errors.cannotCloseInReview);
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
        toast.error(modalT.errors.onlyClosedFromFinalState);
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
        toast.error(modalT.errors.documentsPending);
      } else if (errorCode === 'ONLY_FINANCIAL_CAN_CLOSE') {
        toast.error(modalT.errors.onlyFinancialCanClose);
      } else {
        toast.error(modalT.errorMessages.reject.replace('{{error}}', error.message))
      }
      console.error("Error rejecting subsidy:", error)
    }
  })

  const [addSubsidyRequestMessage] = useMutation(ADD_SUBSIDY_REQUEST_MESSAGE, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: activeSubsidy?.id } }],
    // ...
    onError: (error) => {
      console.error("Error adding message:", error)
      toast.error(modalT.errorMessages.messageSent)
    }
  })

  const [updateSubsidyRequestMessage] = useMutation(UPDATE_SUBSIDY_REQUEST_MESSAGE, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: activeSubsidy?.id } }],
    // ...
    onError: (error) => {
      console.error("Error updating message:", error)
      toast.error(modalT.errorMessages.messageUpdate)
    }
  })

  const [deleteSubsidyRequestMessage] = useMutation(DELETE_SUBSIDY_REQUEST_MESSAGE, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: activeSubsidy?.id } }],
    // ...
    onError: (error) => {
      console.error("Error deleting message:", error)
      toast.error(modalT.errorMessages.messageDelete)
    }
  })

  const [confirmRefundDone] = useMutation(CONFIRM_REFUND_DONE, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: activeSubsidy?.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      const refundT = subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund ||
        subsidyRequestTranslations.en.refund
      toast.success(refundT.refundConfirmSuccess)
      refetchSubsidyDetails()
      onSubsidyUpdated?.()
    },
    onError: (error) => {
      console.error("Error confirming refund:", error)
      toast.error(error.message)
    }
  })

  /**
   * Auto-correct status to WAITING_REFUND if refund is pending
   * This ensures data consistency between refund state and status
   * NOTE: Must be declared AFTER updateSubsidyRequest mutation
   */
  React.useEffect(() => {
    const autoCorrectStatus = async () => {
      // Skip if no subsidy data
      if (!activeSubsidy?.id || !statusesData?.subsidyStatuses) return

      // Check if subsidy has pending refund but wrong status
      const hasPendingRefund = activeSubsidy.have_refund && !activeSubsidy.refund_done
      const isNotWaitingRefund = activeSubsidy.status?.toLowerCase() !== 'waiting_refund'

      if (hasPendingRefund && isNotWaitingRefund) {
        console.log('[DEBUG] Auto-correcting status to WAITING_REFUND for subsidy:', activeSubsidy.id)
        
        // Find WAITING_REFUND status ID
        const waitingRefundStatus = statusesData.subsidyStatuses.find(
          (s: any) => s.name.toLowerCase() === 'waiting_refund'
        )

        if (waitingRefundStatus?.id) {
          try {
            await updateSubsidyRequest({
              variables: {
                id: activeSubsidy.id,
                data: { subsidy_status_id: waitingRefundStatus.id }
              }
            })
            console.log('[DEBUG] Status auto-corrected successfully')
          } catch (error) {
            console.error('[DEBUG] Failed to auto-correct status:', error)
            // Silent fail - don't disrupt user experience
          }
        }
      }
    }

    autoCorrectStatus()
  }, [activeSubsidy?.id, activeSubsidy?.have_refund, activeSubsidy?.refund_done, activeSubsidy?.status, statusesData, updateSubsidyRequest])

  // Helper function to get status ID by name
  const getStatusIdByName = (statusName: string): string | null => {
    const status = subsidyStatuses.find(s => s.name === statusName)
    return status?.id || null
  }

  // Helper function to check if there are rejected documents
  const hasRejectedDocuments = (): boolean => {
    return (receipts || []).some((receipt: any) =>
      receipt.is_validated && !receipt.approved && !receipt.is_deleted
    )
  }

  // Validate status transition
  const canChangeStatus = (to: string) => {
    const from = currentSubsidyStatus

    // Rule: If refund is pending (requested but not done), allow ANY status change
    // This bypasses normal validation rules for subsidies in refund workflow
    if (activeSubsidy.have_refund && !activeSubsidy.refund_done) {
      return true // Allow any transition when refund is pending
    }

    // Rule: Closed status cannot be changed to anything else
    if (from === 'closed') return false

    // Rule: If changing to waiting_refund, must have refund requested
    if (to === 'waiting_refund') {
      return false // Cannot manually change to waiting_refund (auto-updated)
    }

    // Rule: Waiting Refund can ONLY go to Closed
    if (from === 'waiting_refund') {
      return to === 'closed'
    }

    // Rule: Cannot approve if there are rejected documents
    if (to === 'approved' && hasRejectedDocuments()) {
      return false
    }

    // Rule: Advance subsidies logic
    if (activeSubsidy?.is_for_advance) {
      if (from === 'approved') return to === 'advanced_closed'
      if (from === 'advanced_closed') return to === 'closed'
      // pending/in_review follow standard flow to approved/rejected
    } else {
      // Normal subsidies: Cannot go to advanced_closed
      if (to === 'advanced_closed') return false
    }

    // Rule: To Closed is allowed from Approved, Rejected, or Waiting Refund (not In Review)
    if (to === 'closed') {
      if (from === 'in_review') return false
      // Only allowed from approved or rejected (waiting_refund case already handled above)
      return from === 'approved' || from === 'rejected'
    }

    // Rule: If Approved or Rejected, can ONLY go to Closed (for normal subsidies)
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
      // Specific message for rejected documents blocking approval
      if (normalizedStatus === 'approved' && hasRejectedDocuments()) {
        toast.error(modalT.errors.documentsRejected)
      } else {
        toast.error(modalT.errors.statusChangeNotAllowed)
      }
      return
    }

    // Check document validation for pending documents (skip for advance subsidies or if refund is pending)
    if (['approved', 'closed', 'rejected', 'advanced_closed'].includes(normalizedStatus) && 
        !activeSubsidy?.is_for_advance && 
        !(activeSubsidy.have_refund && !activeSubsidy.refund_done)) {
      const hasPending = (receipts || []).some((r: any) => !r.is_validated && !r.is_deleted);
      if (hasPending) {
        toast.error(modalT.errors.documentsPending);
        return;
      }
    }

    // For Rejected, we have a specific dialog with reason input
    if (normalizedStatus === 'rejected') {
      setRejectionDialog({ isOpen: true })
      return
    }

    // For Approved or Closed, we show the confirmation dialog
    if (normalizedStatus === 'approved' || normalizedStatus === 'closed' || normalizedStatus === 'advanced_closed') {
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

    // Store previous status before changing
    setPreviousStatus(currentSubsidyStatus)
    setLastStatusUpdateError(null)

    try {
      if (status === 'approved') {
        setCurrentSubsidyStatus('approved')
        setMentionStatus('approved')
        setNewMessage(modalT.messageFormats.statusChangePrefix.replace('{{status}}', modalT.status?.approved || 'Approved'))

        await approveSubsidyRequest({
          variables: {
            id: activeSubsidy.id,
            approved_amount: activeSubsidy.requested_amount,
            language: i18n.language as any
          }
        })
        // Success - clear any previous errors
        setLastStatusUpdateError(null)
      } else if (status === 'closed' || status === 'advanced_closed') {
        const id = statusId || getStatusIdByName(status === 'closed' ? 'CLOSED' : 'ADVANCED_CLOSED')
        if (id) {
          setCurrentSubsidyStatus(status === 'closed' ? 'closed' : 'advanced_closed')
          setMentionStatus(status === 'closed' ? 'closed' : 'advanced_closed') // Note: mentionStatus type might need update if strict

          // Determine message based on status
          const statusLabel = status === 'closed'
            ? (modalT.status?.closed || 'Closed')
            : (t('subsidy.status.advancedClosed') || 'Advanced Closed');

          setNewMessage(modalT.messageFormats.statusChangePrefix.replace('{{status}}', statusLabel))

          await updateSubsidyRequest({
            variables: {
              id: activeSubsidy.id,
              data: {
                subsidy_status_id: id
              },
              language: i18n.language as any
            }
          })
        }
        // Success - clear any previous errors
        setLastStatusUpdateError(null)
      }
    } catch (error) {
      console.error(`Error changing status to ${status}:`, error)
      // Revert to previous status
      setCurrentSubsidyStatus(previousStatus as any)
      setMentionStatus(null)
      setNewMessage('')
      
      // Set error flag
      const errorMessage = modalT.errors?.statusUpdateFailed || 'Failed to update status. Please try again.'
      setLastStatusUpdateError(errorMessage)
      toast.error(errorMessage)
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

    // Store previous status before changing
    setPreviousStatus(currentSubsidyStatus)
    setLastStatusUpdateError(null)
    setCurrentSubsidyStatus(status as any)
    setMentionStatus(status as any)
    const statusLabel = modalT.status?.[status as keyof typeof modalT.status] || status
    setNewMessage(modalT.messageFormats.statusChangePrefix.replace('{{status}}', statusLabel))
    chatInputRef.current?.focus()

    try {
      await updateSubsidyRequest({
        variables: {
          id: activeSubsidy.id,
          data: { subsidy_status_id: statusId },
          language: i18n.language as any
        }
      })
      // Success - clear any previous errors
      setLastStatusUpdateError(null)
    } catch (error) {
      console.error('Error updating status:', error)
      // Revert to previous status
      setCurrentSubsidyStatus(previousStatus as any)
      setMentionStatus(null)
      setNewMessage('')
      
      // Set error flag
      const errorMessage = modalT.errors?.statusUpdateFailed || 'Failed to update status. Please try again.'
      setLastStatusUpdateError(errorMessage)
      toast.error(errorMessage)
    }
  }
  React.useEffect(() => {
    if (isOpen && activeSubsidy?.id) {
      setLoadingDocuments(true)
      fetchReceipts(activeSubsidy.id)
        .then((fetchedReceipts) => {
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
  }, [isOpen, activeSubsidy?.id])

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
    if (!activeSubsidy || !activeSubsidy.items) return []

    // Group receipts by activity_id
    const receiptsByActivity = receipts.reduce((acc, receipt) => {
      const activityId = receipt.project_activities_id
      if (!acc[activityId]) {
        acc[activityId] = []
      }
      acc[activityId].push(receipt)
      return acc
    }, {} as Record<string, SubsidyReceipt[]>)

    return activeSubsidy.items.map(item => {
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
  }, [activeSubsidy, receipts])

  // Fetch real status history from backend
  const { data: historyData, loading: historyLoading, refetch: refetchHistoryRaw } = useQuery(
    GET_SUBSIDY_STATUS_HISTORY,
    {
      variables: {
        subsidyRequestId: activeSubsidy?.id
      },
      skip: !activeSubsidy?.id,
    }
  )

  // Helper to refresh all data (history + details)
  const refetchHistory = async () => {
    await Promise.all([
      refetchHistoryRaw(),
      refetchSubsidyDetails()
    ])
  }

  // Mutations


  // Transform history data from backend to UI format
  const statusHistory = React.useMemo<StatusHistoryItem[]>(() => {
    if (!historyData?.getSubsidyStatusHistory) return []

    return historyData.getSubsidyStatusHistory.map((item: any) => {
      // Usar traduções do sistema para mensagens de status automáticas
      let translatedReason = item.reason || ''

      // Se é uma alteração de status automática (sem mensagem customizada do usuário)
      if (item.type === 'STATUS_CHANGE' && item.reason) {
        const statusName = item.status.name.toLowerCase()
        const statusKey = `projects.subsidy.${statusName}`
        const statusLabel = t(statusKey) || statusName

        // Se a mensagem parece ser uma mensagem padrão de status, traduzir
        if (item.reason.includes('Status changed to') || item.reason.includes('mudou para') || item.reason.includes('Status alterado para')) {
          translatedReason = modalT.messageFormats.statusChangePrefix.replace('{{status}}', statusLabel)
        }
      }

      return {
        id: item.id,
        status: item.status.name.toLowerCase(),
        type: item.type,
        reason: translatedReason,
        changed_by: item.user.name,
        user_id: item.user.id,
        changed_at: new Date(item.changed_at),
        isNew: false
      }
    })
  }, [historyData, t, modalT, i18n.language])

  // Sync messages with statusHistory from server
  // This ensures messages are updated after refetch from mutations
  React.useEffect(() => {
    if (statusHistory.length > 0) {
      setMessages(statusHistory)
    }
  }, [statusHistory])

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

    // Block sending message if there was an error in the last status update
    if (lastStatusUpdateError) {
      toast.error(modalT.errors?.cannotSendMessageAfterError || 'Cannot send message after status update failed. Please fix the status first.')
      return
    }

    // Handle editing existing message
    if (editingMessage) {
      try {
        await updateSubsidyRequestMessage({
          variables: {
            id: editingMessage,
            message: newMessage,
            language: i18n.language as any
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
      try {
        const messageText = `${newMessage}`
        await addSubsidyRequestMessage({
          variables: {
            id: activeSubsidy?.id,
            message: messageText,
            language: i18n.language as any
          }
        })
        toast.success(t('toasts.commentAdded'))
        setCommentingDocument(null)
        setNewMessage("")
      } catch (error) {
        console.error('Error adding document comment:', error)
      }
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
            id: activeSubsidy?.id,
            message: messageText,
            language: i18n.language as any
          }
        })


        setNewMessage("")
        setMentionStatus(null)
        setMentionPriority(null)
        toast.success(modalT.success.messageSent)
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
        variables: {
          id: deleteCommentDialog.messageId,
          language: i18n.language as any
        }
      })
      toast.success(modalT.success.commentDeleted)
      setDeleteCommentDialog({ isOpen: false, messageId: null })
    } catch (error) {
      // Error handled in useMutation
    }
  }

  const confirmRejection = async (reason: string) => {
    const rejectedLabel = modalT.status?.rejected || 'Rejected'
    setNewMessage(modalT.messageFormats.statusChangeReasonPrefix?.replace('{{status}}', rejectedLabel).replace('{{reason}}', reason) || `Status changed to ${rejectedLabel}. Reason: ${reason}`)
    chatInputRef.current?.focus()

    // Reject subsidy
    await rejectSubsidyRequest({
      variables: {
        id: activeSubsidy.id,
        rejection_reason: reason,
        language: i18n.language as any
      }
    })
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

        toast.success(modalT.success.documentValidated)
        setMentionMode(null)

        // Refetch receipts to update the list
        const updatedReceipts = await fetchReceipts(activeSubsidy?.id)
        setReceipts(updatedReceipts || [])

        // Refetch history from backend
        await refetchHistory()

        // Notify parent to refresh subsidy data (status might have changed)
        onSubsidyUpdated?.()
      } catch (error) {
        console.error('Error validating document:', error)
        // Error toast is already shown by the hook
      }
    } else {
      // Rejeição com nota obrigatória
      if (!newMessage.trim()) {
        toast.error(modalT.documents.addRejectionReason)
        return
      }

      // Call API to reject document
      try {
        await rejectReceipt(docId, newMessage)

        toast.success(modalT.success.documentRejected)
        setMentionMode(null)
        setNewMessage("")

        // Refetch receipts to update the list
        const updatedReceipts = await fetchReceipts(activeSubsidy?.id)
        setReceipts(updatedReceipts || [])

        // Refetch history from backend
        await refetchHistory()

        // Notify parent to refresh subsidy data (status might have changed)
        onSubsidyUpdated?.()
      } catch (error) {
        console.error('Error rejecting document:', error)
        // Error toast is already shown by the hook
      }
    }
  }

  const [isConfirmingRefund, setIsConfirmingRefund] = React.useState(false)

  const handleConfirmRefundDone = async () => {
    if (isConfirmingRefund) return
    setIsConfirmingRefund(true)
    try {
      await confirmRefundDone({
        variables: {
          id: activeSubsidy.id,
          language: i18n.language as any
        }
      })
      await refetchHistory()
      onSubsidyUpdated?.()
      setShowConfirmRefundModal(false)
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsConfirmingRefund(false)
    }
  }

  const statusConfig: Record<
    SubsidyRequestCardData["status"],
    { label: string; icon: React.ElementType; className: string }
  > = {
    pending: {
      label: t('subsidy.status.pending'),
      icon: Clock,
      className: "text-yellow-500"
    },
    approved: {
      label: t('subsidy.status.approved'),
      icon: CheckCircle2,
      className: "text-green-600"
    },
    rejected: {
      label: t('subsidy.status.rejected'),
      icon: XCircle,
      className: "text-red-600"
    },
    in_review: {
      label: t('subsidy.status.inReview'),
      icon: AlertCircle,
      className: "text-blue-500"
    },
    closed: {
      label: t('subsidy.status.closed'),
      icon: Ban,
      className: "text-gray-500"
    },
    advanced_closed: {
      label: t('subsidy.status.advancedClosed') || "Advanced Closed",
      icon: CheckCircle2,
      className: "text-purple-600"
    },
    waiting_refund: {
      label: t('subsidy.status.waitingRefund') || "Waiting Refund",
      icon: DollarSign,
      className: "text-orange-600"
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
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative w-[85vw] h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">

        {/* Header - Minimalista */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {subsidy.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {projectTranslations[i18n.language as keyof typeof projectTranslations]?.subsidy?.requestedOn || 'Requested on:'} {format(new Date(subsidy.requested_at), "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            </div>

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

          <div className="flex flex-col gap-4 pb-5 border-b border-gray-200 dark:border-gray-800">

            {/* KPIs + Dropdowns - Canto Superior Direito */}
            <TooltipProvider>
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Dropdown - Only enabled for Department Leader and Finance */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={!canEditStatus || currentSubsidyStatus === 'closed'}>
                          <button
                            type="button"
                            disabled={!canEditStatus || currentSubsidyStatus === 'closed'}
                            className={cn(
                              "flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md border min-w-[100px] sm:min-w-[140px] justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400",
                              (canEditStatus && currentSubsidyStatus !== 'closed') ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-60",
                              currentSubsidyStatus === 'approved' && "bg-green-50 dark:bg-green-950/30 border-green-500",
                              currentSubsidyStatus === 'rejected' && "bg-red-50 dark:bg-red-950/30 border-red-500",
                              currentSubsidyStatus === 'in_review' && "bg-blue-50 dark:bg-blue-950/30 border-blue-500",
                              currentSubsidyStatus === 'pending' && "bg-amber-50 dark:bg-amber-950/30 border-amber-500",
                              currentSubsidyStatus === 'closed' && "bg-gray-50 dark:bg-gray-950/30 border-gray-500",
                              currentSubsidyStatus === 'advanced_closed' && "bg-purple-50 dark:bg-purple-950/30 border-purple-500",
                              currentSubsidyStatus === 'waiting_refund' && "bg-orange-50 dark:bg-orange-950/30 border-orange-500"
                            )}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <StatusIcon className={cn(
                                "w-3.5 h-3.5 sm:w-4 sm:h-4",
                                currentSubsidyStatus === 'approved' && "text-green-600 dark:text-green-400",
                                currentSubsidyStatus === 'rejected' && "text-red-600 dark:text-red-400",
                                currentSubsidyStatus === 'in_review' && "text-blue-600 dark:text-blue-400",
                                currentSubsidyStatus === 'pending' && "text-amber-600 dark:text-amber-400",
                                currentSubsidyStatus === 'closed' && "text-gray-600 dark:text-gray-400",
                                currentSubsidyStatus === 'advanced_closed' && "text-purple-600 dark:text-purple-400",
                                currentSubsidyStatus === 'waiting_refund' && "text-orange-600 dark:text-orange-400"
                              )} />
                              <span className={cn(
                                "text-xs sm:text-sm font-semibold truncate",
                                currentSubsidyStatus === 'approved' && "text-green-700 dark:text-green-400",
                                currentSubsidyStatus === 'rejected' && "text-red-700 dark:text-red-400",
                                currentSubsidyStatus === 'in_review' && "text-blue-700 dark:text-blue-400",
                                currentSubsidyStatus === 'pending' && "text-amber-700 dark:text-amber-400",
                                currentSubsidyStatus === 'closed' && "text-gray-700 dark:text-gray-400",
                                currentSubsidyStatus === 'advanced_closed' && "text-purple-700 dark:text-purple-400",
                                currentSubsidyStatus === 'waiting_refund' && "text-orange-700 dark:text-orange-400"
                              )}>
                                {currentStatus.label}
                              </span>
                            </div>
                            <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          </button>
                        </DropdownMenuTrigger>
                        {canEditStatus && currentSubsidyStatus !== 'closed' && (
                          <WithPermission requiredPermissions={[PermissionResolverName.ApproveSubsidyRequest, PermissionResolverName.RejectSubsidyRequest, PermissionResolverName.ValidateSubsidyReceipt]}>
                            <DropdownMenuContent align="start" className="z-[100]">
                              <DropdownMenuLabel>{t('subsidy.status.changeStatus')}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChangeRequest('PENDING')}
                        disabled={!canChangeStatus('pending')}
                      >
                        <Clock className="mr-2 h-4 w-4 text-amber-500" />
                        {t('subsidy.status.pending')}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleStatusChangeRequest('IN_REVIEW')}
                        disabled={!canChangeStatus('in_review')}
                      >
                        <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                        {t('subsidy.status.inReview')}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleStatusChangeRequest('APPROVED')}
                        disabled={!canChangeStatus('approved') || !canValidateDocuments}
                        className={cn(
                          (hasRejectedDocuments() || !canValidateDocuments) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <div className="flex flex-col">
                          <span>{t('subsidy.status.approved')}</span>
                          {hasRejectedDocuments() && (
                            <span className="text-xs text-red-600 dark:text-red-400">
                              {t('toasts.documentsRejected') || 'Documentos rejeitados impedem aprovação'}
                            </span>
                          )}
                          {!canValidateDocuments && !hasRejectedDocuments() && (
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              {modalT.permissions.departmentLeaderOnly}
                            </span>
                          )}
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleStatusChangeRequest('REJECTED')}
                        disabled={!canChangeStatus('rejected')}
                      >
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        {t('subsidy.status.rejected')}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleStatusChangeRequest('CLOSED')}
                        disabled={!canChangeStatus('closed')}
                      >
                        <Ban className="mr-2 h-4 w-4 text-gray-500" />
                        {t('subsidy.status.closed')}
                      </DropdownMenuItem>

                      {/* Advanced Closed - Only for advance subsidies */}
                      {activeSubsidy?.is_for_advance && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChangeRequest('ADVANCED_CLOSED')}
                          disabled={!canChangeStatus('advanced_closed')}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-purple-600" />
                          {t('subsidy.status.advancedClosed')}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </WithPermission>
                  )}
                      </DropdownMenu>
                    </div>
                  </TooltipTrigger>
                  {currentSubsidyStatus === 'closed' && (
                    <TooltipContent side="bottom" className="max-w-[280px] z-[80]">
                      <p className="text-xs font-medium">
                        {modalT.errors?.statusClosed || 'O subsídio já está fechado e não pode ser alterado.'}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
                {!canEditStatus && currentSubsidyStatus !== 'closed' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <Info className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[280px] z-[80]">
                      <p className="text-xs font-medium mb-1">
                        {isRequester ? modalT.permissions?.requesterRole : modalT.permissions?.noPermissionRole}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {modalT.permissions?.statusEditInfo}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Priority Dropdown - Only enabled for Department Leader and Finance */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild disabled={currentSubsidyStatus === 'closed' || !canEditStatus}>
                    <button
                      type="button"
                      onClick={(e) => {
                        if (currentSubsidyStatus === 'closed' || !canEditStatus) {
                          e.preventDefault()
                          return
                        }
                      }}
                      disabled={currentSubsidyStatus === 'closed' || !canEditStatus}
                      className={cn(
                        "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 min-w-[100px] sm:min-w-[140px] justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400",
                        (currentSubsidyStatus === 'closed' || !canEditStatus) ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
                      )}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          currentPriority === 'high' && "bg-red-500",
                          currentPriority === 'medium' && "bg-yellow-500",
                          currentPriority === 'low' && "bg-green-500"
                        )} />
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {currentPriority === 'high' && t('subsidy.priority.high')}
                          {currentPriority === 'medium' && t('subsidy.priority.medium')}
                          {currentPriority === 'low' && t('subsidy.priority.low')}
                        </span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="z-[100]">
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
                            data: { priority: 'HIGH' },
                            language: i18n.language as any
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
                            data: { priority: 'MEDIUM' },
                            language: i18n.language as any
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
                            data: { priority: 'LOW' },
                            language: i18n.language as any
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
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 min-w-[80px] sm:min-w-[100px]">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {activities.length}
                      </span>
                      <Info className="w-3 h-3 text-gray-400 ml-auto flex-shrink-0 hidden sm:block" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="z-[70]">
                    <p className="text-xs">{modalT.tooltips.activitiesCount}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Orçamento Total */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 min-w-[90px] sm:min-w-[120px]">
                      <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {formatCurrency(activities.reduce((sum, act) => sum + act.budget_amount, 0))}
                      </span>
                      <Info className="w-3 h-3 text-gray-400 ml-auto flex-shrink-0 hidden sm:block" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="z-[70]">
                    <p className="text-xs">{modalT.tooltips.totalBudget}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Valor Solicitado */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-md border border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 min-w-[90px] sm:min-w-[120px]">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-gray-900 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-white dark:text-gray-900 truncate">
                        {formatCurrency(subsidy.requested_amount)}
                      </span>
                      <Info className="w-3 h-3 text-gray-300 dark:text-gray-700 ml-auto flex-shrink-0 hidden sm:block" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="z-[70]">
                    <p className="text-xs">{modalT.tooltips.requestedAmount}</p>
                  </TooltipContent>
                </Tooltip>

                <AdvanceSubsidyBadge isForAdvance={subsidy.is_for_advance} className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-3 rounded-md border border-gray-200 dark:border-gray-800 min-w-[90px] sm:min-w-[120px]"/>
                  {(subsidy as any).have_refund && !activeSubsidy.refund_done && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs sm:text-sm bg-red-50 text-red-700 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-3 rounded-md  min-w-[90px] sm:min-w-[120px]">
                          <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.refundPending}
                            - {formatCurrency((subsidy as any).refund_amount)}
                          </span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="z-[70]">
                        <div className="space-y-1">
                          <p className="text-xs font-medium">
                            {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.refundPending}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.refundPendingTooltip?.replace('{{amount}}', formatCurrency((subsidy as any).refund_amount))}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
              </div>

            </TooltipProvider>
            {/* Responsible Users */}
            {responsibleUsers.length > 0 && (
              <TooltipProvider delayDuration={200}>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t('subsidy.responsibleUsers') || 'Responsible:'}
                  </span>
                  <UsersAvatarGroup
                    users={responsibleUsers}
                    maxDisplay={3}
                    size="md"
                    showAddButton={false}
                    ownerUserId={responsibleUsers.find(u => u.isOwner)?.id}
                  />
                </div>
              </TooltipProvider>
            )}
            </div>

            {/* Activities Navigation - Only show if not an advance request OR if advance request has documents */}
            {(subsidy.is_for_advance && (!receipts || receipts.length === 0)) ? (
              /* Advance Request Info Panel - Monocromático - Yellow border when refund requested, Green when refund done */
              <div className={cn(
                "space-y-4 border rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50",
                activeSubsidy.have_refund && !activeSubsidy.refund_done
                  ? "border-yellow-400 dark:border-yellow-500 shadow-yellow-100 dark:shadow-yellow-900/20"
                  : activeSubsidy.refund_done
                    ? "border-green-400 dark:border-green-500 shadow-green-100 dark:shadow-green-900/20"
                    : "border-gray-200 dark:border-gray-700"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex justify-between w-full items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <DollarSign className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {t('subsidyRequest.advance.title') || 'Advance Request'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('subsidyRequest.advance.description') || 'Advance payment for project subsidized budget'}
                        </p>
                      </div>
                    </div>
                    {/* Request Refund Button - Only for ADVANCED_CLOSED or CLOSED without refund */}
                      {(activeSubsidy.status === 'advanced_closed' || activeSubsidy.status === 'closed') &&
                        !activeSubsidy.have_refund && (
                          <WithPermission requiredPermissions={[PermissionResolverName.RequestSubsidyRefund]}>
                            <Button
                              onClick={() => setShowRequestRefundModal(true)}
                              variant="outline"
                              size="sm"
                              className="text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-400 hover:bg-yellow-600 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-white"
                            >
                              <DollarSign className="w-4 h-4 mr-2" />
                              {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.requestRefund || "Request Refund"}
                            </Button>
                          </WithPermission>
                        )}
                      {/* Confirm Refund Done Button - Only when refund requested but not done */}
                      {activeSubsidy.have_refund && !activeSubsidy.refund_done && (
                        <WithPermission requiredPermissions={[PermissionResolverName.ConfirmRefundDone]}>
                          <Button
                            onClick={() => setShowConfirmRefundModal(true)}
                            variant="default"
                            size="sm"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.confirmRefundDone || "Confirm Refund Done"}
                          </Button>
                        </WithPermission>
                      )}
                  </div>
                  
                  {/* Activities Badge - Show if there are activities */}
                  {activities.length > 0 && (
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                      <FileText className="w-3 h-3 mr-1" />
                      {activities.length} {activities.length === 1 ? t('subsidy.activity') || 'Activity' : t('subsidy.activities') || 'Activities'}
                    </Badge>
                  )}
                </div>

                <div className={cn(
                  "grid gap-4",
                  (activeSubsidy.have_refund && !activeSubsidy.refund_done) || activeSubsidy.refund_done
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2"
                )}>
                  <div className="p-4 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('subsidyRequest.advance.advanceAmount') || 'Advance Amount'}
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(subsidy.advance_amount || subsidy.requested_amount)}
                    </p>
                  </div>
                  
                  {/* Show Refund KPI based on status */}
                  {activeSubsidy.refund_done ? (
                    <div className="p-4 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-400 dark:border-green-500">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                          {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.refundDone || 'Refund Completed'}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(Number(activeSubsidy.refund_amount || 0))}
                      </p>
                      <p className="text-[10px] text-green-700 dark:text-green-300 mt-1">
                        {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.refundDoneTooltip?.replace('{{amount}}', formatCurrency(Number(activeSubsidy.refund_amount || 0))) || 'Refund processed successfully'}
                      </p>
                    </div>
                  ) : activeSubsidy.have_refund && !activeSubsidy.refund_done ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-500">
                            <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.refundRequestedAmount || 'Refund Amount'}
                            </p>
                            <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                              {formatCurrency(Number(activeSubsidy.refund_amount || 0))}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            {subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund?.refundRequestedTooltip?.replace('{{amount}}', formatCurrency(Number(activeSubsidy.refund_amount || 0))) || `A refund of ${formatCurrency(Number(activeSubsidy.refund_amount || 0))} has been requested and is awaiting confirmation`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <div className="p-4 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('subsidyRequest.advance.status') || 'Status'}
                      </p>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("w-4 h-4", currentStatus.className)} />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currentStatus.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activities Link Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  {activities.length > 0 ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">
                            {t('subsidyRequest.advance.linkedActivitiesTitle') || 'Linked Activities'}
                          </p>
                          <p className="text-xs">
                            {t('subsidyRequest.advance.linkedActivitiesNote') || 'This advance request is associated with project activities that will be funded with this payment.'}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {activities.slice(0, 3).map((act) => (
                              <li key={act.id} className="text-xs flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                {act.name}
                              </li>
                            ))}
                            {activities.length > 3 && (
                              <li className="text-xs text-gray-500">
                                {t('common.andMore', { count: activities.length - 3 }) || `+${activities.length - 3} more`}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
                      <p className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        {t('subsidyRequest.advance.noActivitiesNote') || 'This advance request is not linked to specific activities. It provides upfront funding based on the project subsidized budget.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Regular Subsidy - Activities Navigation */
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
                    )
                  })}
                </div>
              </div>
            )}

            {/* Current Activity Details - Show if not advance request OR if documents exist */}
            {(!subsidy.is_for_advance || (receipts && receipts.length > 0)) && currentActivity && (
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('table.totalRequested')}</p>
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
                                        {t('subsidy.status.approved')}
                                      </Badge>
                                    )}
                                    {doc.is_validated === false && (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-100 dark:bg-red-950/50 border-red-400 text-red-700 dark:text-red-400">
                                        {t('subsidy.status.rejected')}
                                      </Badge>
                                    )}
                                    {doc.is_validated === undefined && (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-100 dark:bg-amber-950/50 border-amber-400 text-amber-700 dark:text-amber-400">
                                        {t('subsidy.status.pending')}
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
                                {doc.is_validated === undefined && currentSubsidyStatus !== 'closed' && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Validate/Reject Buttons - ONLY for Department Leader */}
                                    {canValidateDocuments ? (
                                      <>
                                        <WithPermission requiredPermissions={[PermissionResolverName.ValidateSubsidyReceipt]} partialPermissionCheck>
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
                                            <TooltipContent side="top" className="z-[80]">
                                              <p className="text-xs">{t('subsidy.approveDocument')}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </WithPermission>
                                        <WithPermission requiredPermissions={[PermissionResolverName.ValidateSubsidyReceipt]} partialPermissionCheck>
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
                                            <TooltipContent side="top" className="z-[80]">
                                              <p className="text-xs">{t('subsidy.rejectDocument')}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </WithPermission>
                                      </>
                                    ) : (
                                      /* Info tooltip for users without validation permission */
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                            <Info className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-[250px] z-[80]">
                                          <p className="text-xs font-medium mb-1">
                                            {isRequester ? modalT.permissions?.requesterRole : isFinanceUser ? modalT.permissions?.financeUserRole : modalT.permissions?.noPermissionRole}
                                          </p>
                                          <p className="text-[10px] text-gray-400">
                                            {modalT.permissions?.documentValidationInfo}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                    
                                    {/* Comment Button - Available for ALL users */}
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
                                      <TooltipContent side="top" className="z-[80]">
                                        <p className="text-xs">{t('subsidy.addComment')}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                )}

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownload(doc)}
                                      className="h-7 w-7 p-0 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="z-[80]">
                                    <p className="text-xs">{t('subsidy.downloadDocument')}</p>
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
                        )
                      })}

                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Sidebar - Chat & History */}
          <SubsidyChatPanel
            isSidebarOpen={isSidebarOpen}
            t={t}
            newMessagesCount={newMessagesCount}
            filteredMessages={filteredMessages}
            activities={activities}
            chatFilterActivity={chatFilterActivity}
            setChatFilterActivity={setChatFilterActivity}
            messagesEndRef={messagesEndRef}
            mentionStatus={mentionStatus}
            setMentionStatus={setMentionStatus}
            mentionPriority={mentionPriority}
            setMentionPriority={setMentionPriority}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            commentingDocument={commentingDocument}
            setCommentingDocument={setCommentingDocument}
            mentionMode={mentionMode}
            setMentionMode={setMentionMode}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            chatInputRef={chatInputRef}
            currentSubsidyStatus={currentSubsidyStatus}
            currentPriority={currentPriority}
            statusConfig={statusConfig}
            user={user}
            handleSendMessage={handleSendMessage}
          />

          {/* Toggle Sidebar Button removed (moved to activities header) */}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            {activeSubsidy.institution_name && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Building2 className="w-3.5 h-3.5" />
                <span>{activeSubsidy.institution_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose} className="ml-auto">
                {t('subsidy.close')}
              </Button>
            </div>
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
      <RejectionDialog
        isOpen={rejectionDialog.isOpen}
        onClose={() => setRejectionDialog({ isOpen: false })}
        onConfirm={confirmRejection}
        title={t('rejection.dialog.title')}
        description={t('rejection.dialog.description')}
        warningMessage={t('subsidy.statusChange.warning.rejected')}
        confirmationText={t('rejection.dialog.confirmation')}
      />

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
      {/* Request Refund Modal */}
      <RequestRefundModal
        isOpen={showRequestRefundModal}
        onClose={() => setShowRequestRefundModal(false)}
        subsidyId={activeSubsidy.id}
        currentAmount={activeSubsidy.requested_amount}
        projectName={subsidyData?.subsidyRequest?.project?.name || activeSubsidy.title || 'Projeto sem nome'}
        departmentName={subsidyData?.subsidyRequest?.department?.name || activeSubsidy.department_name || 'Departamento'}
        requester={responsibleUsers.find(u => u.role === (t('subsidy.roles.requester') || 'Solicitante')) || null}
        projectOwner={responsibleUsers.find(u => u.isOwner) || null}
        onSuccess={async () => {
          setShowRequestRefundModal(false)
          await refetchHistory()
          onSubsidyUpdated?.()
        }}
      />

      {/* Confirm Refund Done Modal */}
      <ConfirmRefundDoneModal
        isOpen={showConfirmRefundModal}
        onClose={() => setShowConfirmRefundModal(false)}
        onConfirm={handleConfirmRefundDone}
        refundAmount={Number((activeSubsidy as any).refund_amount || 0)}
        isLoading={isConfirmingRefund}
        projectName={subsidyData?.subsidyRequest?.project?.name || activeSubsidy.title || 'Projeto sem nome'}
        departmentName={subsidyData?.subsidyRequest?.department?.name || activeSubsidy.department_name || 'Departamento'}
        requester={responsibleUsers.find(u => u.role === (t('subsidy.roles.requester') || 'Solicitante')) || null}
        projectOwner={responsibleUsers.find(u => u.isOwner) || null}
      />
    </div >
  )
}
