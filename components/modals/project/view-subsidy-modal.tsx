"use client"

import * as React from "react"
import { X, FileText, Download, Upload, Eye, ExternalLink, Bug, ChevronUp, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign, Building2, User, Calendar, ChevronLeft, ChevronRight, Send, Info, MessageCircle, Check, Ban, AtSign, Pencil, Trash2, Filter, ChevronDown, Plus, RefreshCw, ImageIcon, TrendingUp, Loader2 } from "lucide-react"
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
import { useMutation, useQuery, useLazyQuery } from "@apollo/client"
import { UPDATE_SUBSIDY_REQUEST, APPROVE_SUBSIDY_REQUEST, REJECT_SUBSIDY_REQUEST, ADD_SUBSIDY_REQUEST_MESSAGE, UPDATE_SUBSIDY_REQUEST_MESSAGE, DELETE_SUBSIDY_REQUEST_MESSAGE } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"
import { CONFIRM_REFUND_DONE, REJECT_SUBSIDY_REFUND } from "@/graphql/mutations/REFUND_MUTATIONS"
import { GET_SUBSIDY_STATUS_HISTORY } from "@/graphql/queries/SUBSIDY_STATUS_HISTORY_QUERIES"
import { GET_ALL_SUBSIDY_STATUSES } from "@/graphql/queries/SUBSIDY_STATUS_QUERIES"
import { GET_SUBSIDY_REQUEST_BY_ID } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { GET_PROJECT_ACTIVITIES } from "@/graphql/queries/PROJECTS_QUERY"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { RejectionDialog } from "@/components/modals/project/rejection-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { projectTranslations } from "@/lib/translations/projects"
import { SubsidyChatPanel } from "@/components/modals/project/subsidy-chat-panel"
import { RequestRefundModal } from "@/components/modals/project/request-refund-modal"
import { ConfirmRefundDoneModal } from "@/components/modals/confirm-refund-done-modal"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { SelectActivitiesModal } from "@/components/modals/project/select-activities-modal"
import { ProjectActivityData } from "@/components/projects/project-activities-table"
import { ApolloError } from "@apollo/client"

// ─── Helper: extract a user-friendly message from a GraphQL/Apollo error ──────
function extractSubsidyError(
  error: ApolloError,
  modalT: any,
  fallbackKey: 'statusUpdate' | 'approve' | 'reject' = 'statusUpdate'
): string {
  // NestJS with http.status:400 in extensions causes Apollo to route to networkError,
  // not graphQLErrors. We must check both sources and all nested paths.

  // 1. Collect all error objects from both sources
  const gqlErrors: any[] = error.graphQLErrors ?? []
  const netErrors: any[] = (error.networkError as any)?.result?.errors ?? []
  const allErrors = [...gqlErrors, ...netErrors]

  // 2. Walk all errors to find the specific errorCode
  //    CustomGraphQLError sets: extensions.context.additional.errorCode (most specific)
  //    Fallback:                extensions.additional.errorCode
  //    Last resort:             extensions.code (generic: BAD_REQUEST, NOT_FOUND…)
  let errorCode = ''
  let apiMessage = ''

  for (const err of allErrors) {
    const ext = err?.extensions as any
    // Primary path: context.additional.errorCode
    const specific = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ''
    if (specific) {
      errorCode = specific
      apiMessage = err?.message || ''
      break
    }
    // Keep a generic code as fallback but don't stop — keep looking for a specific one
    if (!errorCode && ext?.code && ext.code !== 'BAD_REQUEST' && ext.code !== 'INTERNAL_SERVER_ERROR') {
      errorCode = ext.code
    }
    if (!apiMessage && err?.message) {
      apiMessage = err.message
    }
  }

  // 3. Map specific errorCodes → user-friendly translated messages
  const errorMap: Record<string, string | undefined> = {
    STATUS_IS_CLOSED:                          modalT.errors?.statusClosed,
    INVALID_TRANSITION_IN_REVIEW_TO_CLOSED:    modalT.errors?.cannotCloseInReview,
    INVALID_TRANSITION_FINAL_STATE:            modalT.errors?.onlyClosedFromFinalState,
    INVALID_TRANSITION_TO_ADVANCED_CLOSED:     modalT.errors?.invalidTransitionToAdvancedClosed    || 'Only APPROVED subsidies can transition to Advanced Closed.',
    INVALID_TRANSITION_FROM_ADVANCED_CLOSED:   modalT.errors?.invalidTransitionFromAdvancedClosed  || 'Advanced Closed can only go to Closed or Waiting for Documents.',
    TRANSITION_REQUIRES_ADVANCE_REQUEST:       modalT.errors?.advanceRequestOnly                   || 'This transition is only allowed for advance-type subsidy requests.',
    INVALID_TRANSITION_TO_WAITING_DOCUMENTS:   modalT.errors?.invalidTransitionToWaitingDocuments  || 'Only APPROVED or ADVANCED_CLOSED subsidies can move to Waiting for Documents.',
    INVALID_TRANSITION_FROM_WAITING_DOCUMENTS: modalT.errors?.invalidTransitionFromWaitingDocuments|| 'Waiting for Documents can only go to Closed or Waiting Refund.',
    DOCUMENTS_NOT_VALIDATED:                   modalT.errors?.documentsPending,
    DOCUMENTS_REJECTED:                        modalT.errors?.documentsRejected,
    EDIT_NOT_ALLOWED_FOR_STATUS:               modalT.errors?.statusChangeNotAllowed,
    ONLY_FINANCIAL_CAN_CLOSE:                  modalT.errors?.onlyFinancialCanClose,
  }

  // 4. Priority: mapped translation → raw API message (readable) → generic fallback
  const mapped = errorCode ? errorMap[errorCode] : undefined
  return (
    mapped ||
    (apiMessage || undefined) ||
    modalT.errors?.statusChangeNotAllowed ||
    'Status change not allowed. Please try again.'
  )
}
// ──────────────────────────────────────────────────────────────────────────────

interface ActivityItem {
  id: string           // ProjectActivity.id  — used as project_activity_id
  itemId: string       // SubsidyRequestItem.id — used as subsidy_request_item_id
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
  /** All activities from the project — used to populate the Link Activity picker for ADVANCE subsidies */
  allActivities?: ProjectActivityData[]
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
  onSubsidyUpdated,
  allActivities = [],
}: ViewSubsidyModalProps) {
  // Early return BEFORE any hooks to maintain consistent hook order
  if (!isOpen || !subsidy) {
    return null
  }

  // Subsidy prop received - no debug logs in production

  const { formatCurrency, selectedCurrency } = useCurrency()
  const { user } = useAuth()
  const { currentInstitutionData } = useInstitution()
  const { t, i18n } = useTranslation()

  // Helper para acessar traduções do modal
  const modalT = React.useMemo(() => {
    const lang = i18n.language as keyof typeof projectTranslations
    return projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal
  }, [i18n.language])

  // Refund translations
  const refundT = React.useMemo(() => {
    return subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund ||
      subsidyRequestTranslations.en.refund
  }, [i18n.language])

  const [selectedActivityIndex, setSelectedActivityIndex] = React.useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [newMessage, setNewMessage] = React.useState("")
  const [messages, setMessages] = React.useState<StatusHistoryItem[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const uploadFileInputRef = React.useRef<HTMLInputElement>(null)
  const refundReceiptInputRef = React.useRef<HTMLInputElement>(null)
  const [documentValidations, setDocumentValidations] = React.useState<Record<string, { note: string; isValid: boolean | null }>>({})
  const [mentionMode, setMentionMode] = React.useState<string | null>(null)
  const [commentingDocument, setCommentingDocument] = React.useState<{ id: string; name: string } | null>(null)
  const [documentComment, setDocumentComment] = React.useState("")
  const [editingMessage, setEditingMessage] = React.useState<string | null>(null)
  const [chatFilterActivity, setChatFilterActivity] = React.useState<string | null>(null)
  const [currentSubsidyStatus, setCurrentSubsidyStatus] = React.useState<"pending" | "in_review" | "approved" | "rejected" | "closed" | "advanced_closed" | "waiting_refund" | "waiting_documents">(subsidy?.status || "pending")
  const [currentPriority, setCurrentPriority] = React.useState<"low" | "medium" | "high">("medium")
  const [mentionStatus, setMentionStatus] = React.useState<"pending" | "in_review" | "approved" | "rejected" | "closed" | "advanced_closed" | "waiting_refund" | "waiting_documents" | null>(null)
  const [mentionPriority, setMentionPriority] = React.useState<"low" | "medium" | "high" | null>(null)
  const chatInputRef = React.useRef<HTMLInputElement>(null)
  const [loadingDocuments, setLoadingDocuments] = React.useState(false)
  const [receipts, setReceipts] = React.useState<SubsidyReceipt[]>([])
  const [subsidyStatuses, setSubsidyStatuses] = React.useState<Array<{ id: string, name: string, description: string }>>([])
  const [lastStatusUpdateError, setLastStatusUpdateError] = React.useState<string | null>(null)
  const [previousStatus, setPreviousStatus] = React.useState<string>(subsidy?.status || "pending")

  // ─── Document Preview ──────────────────────────────────────────────────────
  const [previewDocument, setPreviewDocument] = React.useState<DocumentItem | null>(null)

  // ─── Debug Panel (dev-only) ────────────────────────────────────────────────
  const [showDebugPanel, setShowDebugPanel] = React.useState(false)
  const [receiptFetchError, setReceiptFetchError] = React.useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = React.useState<Date | null>(null)

  // Dialog states for replacing browser alerts
  const [deleteCommentDialog, setDeleteCommentDialog] = React.useState<{ isOpen: boolean; messageId: string | null }>({ isOpen: false, messageId: null })
  const [rejectionDialog, setRejectionDialog] = React.useState<{ isOpen: boolean }>({ isOpen: false })
  const [statusConfirmationDialog, setStatusConfirmationDialog] = React.useState<{
    isOpen: boolean;
    status: "approved" | "rejected" | "closed" | "advanced_closed" | "waiting_documents" | null;
    statusId?: string
  }>({ isOpen: false, status: null })

  // Refund modal state
  const [showRequestRefundModal, setShowRequestRefundModal] = React.useState(false)
  const [showConfirmRefundModal, setShowConfirmRefundModal] = React.useState(false)
  const [rejectRefundDialog, setRejectRefundDialog] = React.useState<{ isOpen: boolean; reason: string }>({ isOpen: false, reason: '' })

  // Refund receipt upload note + validate dialog state
  const [refundUploadNote, setRefundUploadNote] = React.useState('')
  const [refundValidateDialog, setRefundValidateDialog] = React.useState<{ receiptId: string; note: string } | null>(null)

  // Link Activity dialog state (for ADVANCE subsidies)
  const [showLinkActivityDialog, setShowLinkActivityDialog] = React.useState(false)
  const [linkingActivity, setLinkingActivity] = React.useState(false)

  // Mobile chat panel open state
  const [isMobileChatOpen, setIsMobileChatOpen] = React.useState(false)

  // Activity delete confirmation state (double-click pattern)
  const [confirmDeleteActivityId, setConfirmDeleteActivityId] = React.useState<string | null>(null)

  // Upload document amount dialog
  const [uploadAmountDialog, setUploadAmountDialog] = React.useState<{
    isOpen: boolean
    file: File | null
    amount: string
    projectActivityId: string
    subsidyRequestItemId: string | undefined
    receiptType: 'pdf' | 'image' | 'invoice'
  }>({ isOpen: false, file: null, amount: '', projectActivityId: '', subsidyRequestItemId: undefined, receiptType: 'pdf' })

  // Fetch ALL departments from system for internal use
  const { data: allDepartmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    fetchPolicy: 'network-only',
  })

  // Lazy query for project activities (used in ADVANCE link-activity dialog)
  const [fetchProjectActivities, { data: projectActivitiesData, loading: loadingProjectActivities }] =
    useLazyQuery(GET_PROJECT_ACTIVITIES, { fetchPolicy: 'network-only' })

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
  // We overlay fresh fields from the API response, including re-mapping items so that
  // activity_id always matches receipt.project_activities_id (the server field name).
  const activeSubsidy = React.useMemo(() => {
    if (!subsidyData?.subsidyRequest) return subsidy

    const fresh = subsidyData.subsidyRequest

    // Re-map items from the fresh query so activity_id is always correct.
    // fresh.items uses project_activity_id (server name) — map it to activity_id used internally.
    const freshItems = fresh.items?.map((item: any) => ({
      id: item.id,
      activity_id: item.project_activity_id,
      activity_name: item.project_activity?.name || subsidy.items?.find((si: any) => si.id === item.id)?.activity_name || 'Unknown',
      requested_amount: Number(item.requested_amount),
      approved_amount: Number(item.approved_amount || 0),
      budget_amount: Number(item.project_activity?.budget_amount || 0),
      notes: item.notes,
      activity: {
        id: item.project_activity?.id,
        name: item.project_activity?.name,
        description: item.project_activity?.description,
        budget_amount: Number(item.project_activity?.budget_amount || 0),
        status: item.project_activity?.status,
        priority: item.project_activity?.priority,
        is_subsidized: item.project_activity?.is_subsidized,
      },
    }))

    return {
      ...subsidy,
      status: fresh.subsidy_status?.name?.toLowerCase() || subsidy.status,
      have_refund: fresh.have_refund,
      refund_done: fresh.refund_done,
      refund_amount: fresh.refund_amount,
      refund_type: fresh.refund_type,
      refund_rejected: fresh.refund_rejected,
      // Use fresh items if available (more reliable activity_id mapping)
      items: (freshItems && freshItems.length > 0) ? freshItems : subsidy.items,
    }
  }, [subsidy, subsidyData])

  /**
   * Responsible users — sourced from the API's `collaborators` field.
   * Falls back to computing from institution context when collaborators are unavailable.
   */
  const responsibleUsers = React.useMemo<UserAvatarData[]>(() => {
    const collaborators: Array<{ role: string; user: { id: string; name: string; email?: string } }> =
      subsidyData?.subsidyRequest?.collaborators || []

    if (collaborators.length > 0) {
      const seen = new Set<string>()
      return collaborators
        .filter(c => { if (seen.has(c.user.id)) return false; seen.add(c.user.id); return true })
        .map(c => ({
          id: c.user.id,
          name: c.user.name,
          email: c.user.email || '',
          role: t(`subsidy.roles.${c.role}`) || c.role,
          isOwner: c.role === 'owner',
          isCoOwner: c.role === 'co_owner',
          isFinance: c.role === 'finance',
        }))
    }

    // ── Fallback: compute from institution context ───────────────────────────
    const users: UserAvatarData[] = []
    const subsidyDepartment = subsidyData?.subsidyRequest?.department
    const subsidyProject = subsidyData?.subsidyRequest?.project
    const institutionUsers = currentInstitutionData?.users || []
    const activeUsers = institutionUsers.filter((u: any) => !u.is_deleted)

    const requesterId = subsidyData?.subsidyRequest?.created_by
    const requester = requesterId ? activeUsers.find((u: any) => u.id === requesterId) : null
    if (requester && !users.some(u => u.id === requester.id)) {
      users.push({ id: requester.id, name: requester.name, email: requester.email || '', role: t('subsidy.roles.requester') || 'Solicitante', isOwner: false })
    }

    const projectOwner = subsidyProject?.owner
    if (projectOwner && !users.some(u => u.id === projectOwner.id)) {
      users.push({ id: projectOwner.id, name: projectOwner.name, email: projectOwner.email || '', role: t('subsidy.roles.projectOwner') || 'Dono do Projeto', isOwner: true })
    }

    const projectCoOwner = subsidyData?.subsidyRequest?.project?.co_owner
    if (projectCoOwner && !users.some(u => u.id === projectCoOwner.id)) {
      users.push({ id: projectCoOwner.id, name: projectCoOwner.name, email: projectCoOwner.email || '', role: t('subsidy.roles.coOwner') || 'Co-Owner', isCoOwner: true })
    }

    const leader = subsidyDepartment?.leader || activeUsers.find((u: any) => u.id === subsidyDepartment?.leader_id)
    if (leader && !users.some(u => u.id === leader.id)) {
      users.push({ id: leader.id, name: leader.name, email: leader.email || '', role: t('subsidy.roles.departmentLeader') || 'Líder do Departamento' })
    }

    const financeRoleKeys = ['FINANCE_MANAGER', 'FINANCE_ADMIN', 'FINANCIAL_MANAGER', 'CFO', 'FINANCIAL_OFFICER', 'FINANCE']
    activeUsers
      .filter((u: any) => u.user_roles?.some((ur: any) => financeRoleKeys.includes(ur.role?.key_code?.toUpperCase() || '')))
      .forEach((u: any) => {
        if (!users.some(x => x.id === u.id)) {
          users.push({ id: u.id, name: u.name, email: u.email || '', role: t('subsidy.roles.financeManager') || 'Gestor Financeiro' })
        }
      })

    return users
  }, [subsidyData, currentInstitutionData, t])

  /**
   * Permission Checks for Document Validation
   * 
   * RULES:
   * 1. Department Leader: Can validate/reject/delete documents ✅
   * 2. Finance Users: Can validate/reject/delete documents ✅
   * 3. Project Owner: Can validate/reject/delete documents + unlink activities ✅
   * 4. Requester: Can ONLY comment 💬
   *
   * Source of truth (in priority order):
   *   1. collaborators[] from API  → most reliable
   *   2. department.leader.id      → fallback
   *   3. project.owner.id          → fallback
   *   4. user_roles from institution context (finance)
   */

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

  const isProjectOwner = React.useMemo(() => {
    // Primary: check via collaborators (most reliable — populated by backend for every role)
    const collaborators: Array<{ role: string; user: { id: string } }> = subsidyData?.subsidyRequest?.collaborators || []
    if (collaborators.some(c => c.role === 'owner' && c.user?.id === user?.id)) return true
    // Fallback: match against project.owner scalar fields
    const ownerId = subsidyData?.subsidyRequest?.project?.owner?.id || subsidyData?.subsidyRequest?.project?.owner_id
    return !!user?.id && user.id === ownerId
  }, [user?.id, subsidyData])

  const canValidateDocuments = React.useMemo(() => {
    if (!user?.id) return false

    // PRIMARY: check via collaborators — roles 'owner', 'leader', 'finance' can validate
    const collaborators: Array<{ role: string; user: { id: string } }> = subsidyData?.subsidyRequest?.collaborators || []
    if (collaborators.some(c => ['owner', 'leader', 'finance'].includes(c.role) && c.user?.id === user?.id)) return true

    // FALLBACK: match department leader by ID (when collaborators are not populated)
    const subsidyDepartment = subsidyData?.subsidyRequest?.department
    const leaderId = subsidyDepartment?.leader?.id || subsidyDepartment?.leader_id
    const isDepartmentLeader = !!leaderId && user.id === leaderId

    // Finance check via institution context (covers users not in collaborators list)
    return isDepartmentLeader || isFinanceUser || isProjectOwner
  }, [user?.id, subsidyData, isFinanceUser, isProjectOwner])

  const canDeleteDocuments = React.useMemo(() => {
    // Project Owner, Finance User, or Department Leader can delete documents
    return isProjectOwner || isFinanceUser || canValidateDocuments
  }, [isProjectOwner, isFinanceUser, canValidateDocuments])

  const canEditStatus = React.useMemo(() => {
    // If refund is pending, ALWAYS allow status editing (bypass permission checks)
    if (activeSubsidy.have_refund && !activeSubsidy.refund_done) {
      return true
    }

    // Normal rule: Only Department Leader OR Finance User can edit status
    return canValidateDocuments || isFinanceUser
  }, [canValidateDocuments, isFinanceUser, activeSubsidy])

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
    deleteReceipt,
    downloadReceipt,
    loading: receiptsLoading,
    uploading: receiptsUploading,
    validating: receiptsValidating,
    uploadReceipt,
    uploadRefundReceipt,
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
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal
      const message = extractSubsidyError(error, modalT, 'statusUpdate')
      toast.error(message, { duration: 5000 })
      console.error('Error updating subsidy status:', error)
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
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal
      const message = extractSubsidyError(error, modalT, 'approve')
      toast.error(message, { duration: 5000 })
      console.error('Error approving subsidy:', error)
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
      const lang = i18n.language as keyof typeof projectTranslations
      const modalT = projectTranslations[lang]?.viewSubsidyModal || projectTranslations.pt.viewSubsidyModal
      const message = extractSubsidyError(error, modalT, 'reject')
      toast.error(message, { duration: 5000 })
      console.error('Error rejecting subsidy:', error)
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

  const [rejectSubsidyRefund, { loading: isRejectingRefund }] = useMutation(REJECT_SUBSIDY_REFUND, {
    refetchQueries: [{ query: GET_SUBSIDY_STATUS_HISTORY, variables: { subsidyRequestId: activeSubsidy?.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success(t('subsidy.refundRejected') || "Refund rejected successfully.")
      refetchSubsidyDetails()
      onSubsidyUpdated?.()
      setRejectRefundDialog({ isOpen: false, reason: '' })
    },
    onError: (error) => {
      console.error("Error rejecting refund:", error)
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

    // Rule: waiting_refund is triggered via the "Request Refund" button (not the status dropdown)
    if (to === 'waiting_refund') {
      return false
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
      if (from === 'approved') return to === 'waiting_documents' || to === 'advanced_closed'
      if (from === 'advanced_closed') return to === 'waiting_documents' || to === 'closed'
      if (from === 'waiting_documents') return to === 'closed' || to === 'waiting_refund'
      // pending/in_review follow standard flow to approved/rejected
    } else {
      // Normal subsidies: Cannot go to advanced_closed or waiting_documents
      if (to === 'advanced_closed' || to === 'waiting_documents') return false
    }

    // Rule: To Closed is allowed from Approved, Rejected, Waiting Documents (not In Review directly)
    if (to === 'closed') {
      if (from === 'in_review') return false
      return from === 'approved' || from === 'rejected' || from === 'waiting_documents'
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

    // For Approved, Closed, Advanced Closed or Waiting Documents, show confirmation dialog
    if (normalizedStatus === 'approved' || normalizedStatus === 'closed' || normalizedStatus === 'advanced_closed' || normalizedStatus === 'waiting_documents') {
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

    setLastStatusUpdateError(null)

    try {
      if (status === 'approved') {
        await approveSubsidyRequest({
          variables: {
            id: activeSubsidy.id,
            approved_amount: activeSubsidy.requested_amount,
            language: i18n.language as any
          }
        })
        // onCompleted handles success UI update
        setCurrentSubsidyStatus('approved')
        setMentionStatus('approved')
        setNewMessage(projectTranslations.en.viewSubsidyModal.messageFormats.statusChangePrefix.replace('{{status}}', projectTranslations.en.viewSubsidyModal.status?.approved || 'Approved'))
      } else if (status === 'closed' || status === 'advanced_closed' || status === 'waiting_documents') {
        const statusNameMap: Record<string, string> = {
          'closed': 'CLOSED',
          'advanced_closed': 'ADVANCED_CLOSED',
          'waiting_documents': 'WAITING_DOCUMENTS'
        }
        const id = statusId || getStatusIdByName(statusNameMap[status])
        if (id) {
          const result = await updateSubsidyRequest({
            variables: {
              id: activeSubsidy.id,
              data: { subsidy_status_id: id },
              language: i18n.language as any
            }
          })
          // Only update UI if mutation succeeded (no errors)
          if (!result?.errors?.length) {
            setCurrentSubsidyStatus(status as any)
            setMentionStatus(status as any)
            const statusLabel = status === 'closed'
              ? (projectTranslations.en.viewSubsidyModal.status?.closed || 'Closed')
              : status === 'advanced_closed' ? 'Advanced Closed' : 'Waiting for Documents'
            setNewMessage(projectTranslations.en.viewSubsidyModal.messageFormats.statusChangePrefix.replace('{{status}}', statusLabel))
          }
        }
      }
    } catch (error) {
      // Apollo mutations with onError don't throw — this only catches unexpected JS errors
      console.error(`Unexpected error changing status to ${status}:`, error)
    }
    setStatusConfirmationDialog({ isOpen: false, status: null })
  }

  // Helper to execute immediate status changes (pending, in_review, rejected)
  const executeStatusChange = async (status: string) => {
    const statusId = getStatusIdByName(status.toUpperCase())
    if (!statusId) {
      toast.error(t('filters.status') + ' ' + t('common.notFound'))
      return
    }

    setLastStatusUpdateError(null)

    try {
      const result = await updateSubsidyRequest({
        variables: {
          id: activeSubsidy.id,
          data: { subsidy_status_id: statusId },
          language: i18n.language as any
        }
      })
      // Only update UI if mutation succeeded
      if (!result?.errors?.length) {
        setCurrentSubsidyStatus(status as any)
        setMentionStatus(status as any)
        const statusLabel = projectTranslations.en.viewSubsidyModal.status?.[status as keyof typeof projectTranslations.en.viewSubsidyModal.status] || status
        setNewMessage(projectTranslations.en.viewSubsidyModal.messageFormats.statusChangePrefix.replace('{{status}}', statusLabel))
        chatInputRef.current?.focus()
      }
    } catch (error) {
      // Apollo mutations with onError don't throw — this only catches unexpected JS errors
      console.error('Unexpected error updating status:', error)
    }
  }
  React.useEffect(() => {
    if (isOpen && activeSubsidy?.id) {
      setLoadingDocuments(true)
      setReceiptFetchError(null)
      fetchReceipts(activeSubsidy.id)
        .then((fetchedReceipts) => {
          setReceipts(fetchedReceipts || [])
          setLastFetchTime(new Date())
        })
        .catch((error) => {
          const msg = error?.message || 'Unknown error'
          setReceiptFetchError(msg)
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

    return (activeSubsidy.items as NonNullable<SubsidyRequestCardData['items']>).map(item => {
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
        id: item.activity_id,     // ProjectActivity.id
        itemId: item.id,          // SubsidyRequestItem.id
        name: item.activity_name,
        budget_amount: item.budget_amount,
        // For ADVANCE subsidies, the actual spend is tracked via receipts — sum non-deleted receipt amounts.
        // For other types, use the server-side requested_amount on the item.
        requested_amount: activeSubsidy.is_for_advance
          ? activityReceipts.filter(r => !r.is_deleted).reduce((sum, r) => sum + (r.amount || 0), 0)
          : item.requested_amount,
        documents: documents
      }
    })
  }, [activeSubsidy, receipts])

  // ─── Debug Info (dev-only) ─────────────────────────────────────────────────
  const debugInfo = React.useMemo(() => {
    const receiptsByActivity = receipts.reduce((acc, r) => {
      const key = r.project_activities_id
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Per-activity document count for validation
    const activitiesDetail = activities.map(act => ({
      id: act.id,
      name: act.name,
      documentsCount: act.documents.length,
    }))

    // Activity IDs from activeSubsidy.items for cross-reference
    const itemsActivityIds = (activeSubsidy?.items || []).map((item: any) => item.activity_id)

    // Resolve the exact project_activity_id that would be sent for the current activity (mirrors handleFileUpload logic)
    const currentAct = activities[selectedActivityIndex]
    const rawItemForCurrent = currentAct
      ? (activeSubsidy?.items || []).find((it: any) => it.id === currentAct.itemId || it.activity_id === currentAct.id)
      : null
    const resolvedProjectActivityId: string | null =
      (rawItemForCurrent as any)?.activity?.id ||
      (rawItemForCurrent as any)?.activity_id ||
      currentAct?.id ||
      null

    return {
      subsidyId: activeSubsidy?.id,
      requestType: (activeSubsidy as any).request_type || 'unknown',
      isForAdvance: subsidy.is_for_advance,
      totalReceipts: receipts.length,
      activitiesInSubsidy: activeSubsidy?.items?.length ?? 0,
      activitiesResolved: activities.length,
      documentsInCurrentActivity: activities[selectedActivityIndex]?.documents?.length ?? 0,
      currentActivityUploadIds: {
        subsidy_request_id: activeSubsidy?.id || null,
        project_activity_id: resolvedProjectActivityId,
        subsidy_request_item_id: currentAct?.itemId || null,
        type: '(derivado do arquivo)',
        amount: currentAct?.requested_amount ?? null,
      },
      activitiesDetail,
      itemsActivityIds,
      receiptsByActivity,
      receiptFetchError,
      lastFetchTime: lastFetchTime?.toLocaleTimeString() || null,
      loadingDocuments,
      receiptsLoading,
      receiptsUploading,
      rawReceipts: receipts.map(r => ({
        id: r.id,
        activityId: r.project_activities_id,
        filename: r.filename,
        amount: r.amount,
        is_validated: r.is_validated,
        approved: r.approved,
        file_url: r.file_url ? r.file_url.slice(0, 60) + '...' : null,
      })),
    }
  }, [activeSubsidy, subsidy, receipts, activities, selectedActivityIndex, receiptFetchError, lastFetchTime, loadingDocuments, receiptsLoading, receiptsUploading])
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

  // Keep selectedActivityIndex in bounds when activities change (e.g. after unlinking)
  React.useEffect(() => {
    if (activities.length > 0 && selectedActivityIndex >= activities.length) {
      setSelectedActivityIndex(activities.length - 1)
    }
  }, [activities.length, selectedActivityIndex])

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
        const enStatus = projectTranslations.en.viewSubsidyModal.status?.[mentionStatus as keyof typeof projectTranslations.en.viewSubsidyModal.status] || mentionStatus
        messageText = `@Status: ${enStatus} - ${messageText}`
      }

      // Add priority mention if present
      if (mentionPriority) {
        const priorityLabel = mentionPriority === 'high' ? 'High' : mentionPriority === 'medium' ? 'Medium' : 'Low'
        messageText = `@Priority: ${priorityLabel} - ${messageText}`
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
    const rejectedLabel = projectTranslations.en.viewSubsidyModal.status?.rejected || 'Rejected'
    setNewMessage(projectTranslations.en.viewSubsidyModal.messageFormats.statusChangeReasonPrefix?.replace('{{status}}', rejectedLabel).replace('{{reason}}', reason) || `Status changed to ${rejectedLabel}. Reason: ${reason}`)
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

  const handleRejectRefundConfirmed = async () => {
    if (isRejectingRefund || !rejectRefundDialog.reason.trim()) return
    await rejectSubsidyRefund({
      variables: {
        id: activeSubsidy.id,
        reason: rejectRefundDialog.reason.trim(),
        language: i18n.language as any
      }
    })
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
    },
    waiting_documents: {
      label: t('subsidy.status.waitingDocuments') || "Waiting for Documents",
      icon: FileText,
      className: "text-orange-800"
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

  // ─── Google Drive URL utilities ───────────────────────────────────────────
  /**
   * Extracts a Google Drive file ID from common GDrive URL formats.
   * Handles: /file/d/ID/view, /open?id=ID, uc?id=ID, etc.
   */
  const extractGDriveFileId = (url: string): string | null => {
    if (!url) return null
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match?.[1]) return match[1]
    }
    return null
  }

  const isGDriveUrl = (url: string): boolean =>
    Boolean(url && (url.includes('drive.google.com') || url.includes('docs.google.com')))

  /**
   * Returns a URL that can be embedded in an <iframe> for preview.
   * Google Drive requires the /preview endpoint for embedding.
   * For images/PDFs hosted elsewhere, returns the original URL.
   */
  const getEmbedUrl = (url: string): string => {
    if (!url) return url
    if (isGDriveUrl(url)) {
      const fileId = extractGDriveFileId(url)
      if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`
    }
    return url
  }

  /**
   * Returns a direct content URL for images (not a Google Drive page URL).
   * Used for <img> tags.
   */
  const getDirectImageUrl = (url: string): string => {
    if (!url) return url
    if (isGDriveUrl(url)) {
      const fileId = extractGDriveFileId(url)
      if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`
    }
    return url
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

  // Request type + project name for header display
  const requestType: string = (activeSubsidy as any).request_type || (subsidy.is_for_advance ? 'ADVANCE' : 'WITH_DOCUMENT')
  const projectName = subsidyData?.subsidyRequest?.project?.title || ''

  // Manual refresh of receipts (for debug panel and retry)
  const handleManualRefetchReceipts = async () => {
    if (!activeSubsidy?.id) return
    setLoadingDocuments(true)
    setReceiptFetchError(null)
    try {
      const freshReceipts = await fetchReceipts(activeSubsidy.id)
      setReceipts(freshReceipts || [])
      setLastFetchTime(new Date())
    } catch (error: any) {
      const msg = error?.message || 'Unknown error'
      setReceiptFetchError(msg)
      toast.error('Erro ao recarregar documentos')
    } finally {
      setLoadingDocuments(false)
    }
  }

  // ─── Link Activity (ADVANCE subsidies) ───────────────────────────────────
  // Statuses that block linking: in_review, advanced_closed, closed
  const BLOCKED_LINK_STATUSES = ['in_review', 'advanced_closed', 'closed']
  const canLinkActivity = subsidy.is_for_advance && !BLOCKED_LINK_STATUSES.includes(currentSubsidyStatus)

  // IDs already linked — to exclude from the picker
  const linkedActivityIds = React.useMemo(
    () => new Set((activeSubsidy.items || []).map((it: any) => it.activity_id as string)),
    [activeSubsidy.items]
  )

  // Available activities for SelectActivitiesModal:
  // Prefer the allActivities prop (already fetched by parent) over the lazy query result.
  const availableActivitiesToLink = React.useMemo<ProjectActivityData[]>(() => {
    if (allActivities.length > 0) {
      return allActivities.filter(a => !a.is_deleted)
    }
    // Fallback: use lazy query result (mapped to ProjectActivityData shape)
    const all: Array<{ id: string; name: string; budget_amount: number; is_deleted?: boolean; project_id?: string; status?: string; is_subsidized?: boolean }> =
      projectActivitiesData?.projectActivities || []
    return all
      .filter(a => !a.is_deleted)
      .map(a => ({
        id: a.id,
        project_id: a.project_id || '',
        name: a.name,
        description: '',
        budget_amount: Number(a.budget_amount),
        deadline: '',
        status: a.status || 'pending',
        priority: 'medium',
        created_at: '',
        updated_at: '',
        is_subsidized: a.is_subsidized ?? false,
      }))
  }, [allActivities, projectActivitiesData])

  const handleOpenLinkActivityDialog = () => {
    // Only fire the lazy query when no activities were passed via props
    if (allActivities.length === 0) {
      const projectId =
        subsidyData?.subsidyRequest?.project_id ||
        subsidyData?.subsidyRequest?.project?.id ||
        (subsidy as any).project_id
      if (projectId) {
        fetchProjectActivities({ variables: { filters: JSON.stringify({ project_id: projectId }) } })
      }
    }
    setShowLinkActivityDialog(true)
  }

  const handleUnlinkActivity = async (activityId: string) => {
    const remainingItems = (activeSubsidy.items || [])
      .filter((item: any) => item.activity_id !== activityId)
      .map((item: any) => ({
        project_activity_id: item.activity_id,
        requested_amount: item.requested_amount,
        notes: item.notes || undefined,
      }))
    try {
      await updateSubsidyRequest({
        variables: {
          id: activeSubsidy.id,
          data: { items: remainingItems },
          language: i18n.language as any,
        },
      })

      // Auto-reset to pending (draft) when all activities are removed
      if (remainingItems.length === 0 && currentSubsidyStatus !== 'pending') {
        const pendingStatusId = getStatusIdByName('PENDING')
        if (pendingStatusId) {
          await updateSubsidyRequest({
            variables: {
              id: activeSubsidy.id,
              data: { subsidy_status_id: pendingStatusId },
              language: i18n.language as any,
            },
          })
          setCurrentSubsidyStatus('pending')
        }
      }

      // Adjust selectedActivityIndex to stay in bounds
      if (remainingItems.length === 0) {
        setSelectedActivityIndex(0)
      } else if (selectedActivityIndex >= remainingItems.length) {
        setSelectedActivityIndex(remainingItems.length - 1)
      }

      // Register activity removal in subsidy history
      const unlinkedActivityName = activities.find(a => a.id === activityId)?.name || activityId
      try {
        await addSubsidyRequestMessage({
          variables: {
            id: activeSubsidy?.id,
            message: `Activity Deleted: ${unlinkedActivityName}`,
            language: i18n.language as any
          }
        })
      } catch { /* non-critical — history log failure should not block the operation */ }
      await refetchSubsidyDetails()
    } catch (err: any) {
      toast.error(err?.message || 'Error to unlink activity. Please try again.')
    }
  }

  const handleLinkActivities = async (selectedActivities: ProjectActivityData[]) => {
    if (selectedActivities.length === 0) return
    setLinkingActivity(true)
    try {
      // Preserve existing items — items array is replace-style (no append mutation)
      const existingItems = (activeSubsidy.items || []).map((item: any) => ({
        project_activity_id: item.activity_id,
        requested_amount: item.requested_amount,
        notes: item.notes || undefined,
      }))
      const newItems = selectedActivities.map(a => ({
        project_activity_id: a.id,
        requested_amount: 0,
      }))
      await updateSubsidyRequest({
        variables: {
          id: activeSubsidy.id,
          data: { items: [...existingItems, ...newItems] },
          language: i18n.language as any,
        },
      })

      // Register each linked activity in subsidy history
      for (const activity of selectedActivities) {
        try {
          await addSubsidyRequestMessage({
            variables: {
              id: activeSubsidy?.id,
              message: `Activity Linked: ${activity.name}`,
              language: i18n.language as any,
            }
          })
        } catch { /* non-critical — history log failure should not block the operation */ }
      }

      await refetchSubsidyDetails()
      setShowLinkActivityDialog(false)
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao vincular atividade.')
    } finally {
      setLinkingActivity(false)
    }
  }

  // File upload handler — opens amount dialog before uploading
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentActivity) return
    e.target.value = '' // reset so same file can be re-selected

    const allowedMime = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedMime.includes(file.type)) {
      toast.error('Formato não suportado. Use JPG, PNG ou PDF.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB.')
      return
    }

    // -- Resolve IDs before opening dialog
    const subsidyRequestId = activeSubsidy.id
    const rawItem = activeSubsidy.items?.find((it: any) => it.id === currentActivity.itemId || it.activity_id === currentActivity.id)
    const projectActivityId: string =
      (rawItem as any)?.activity?.id ||
      (rawItem as any)?.activity_id ||
      currentActivity.id

    const subsidyRequestItemId: string | undefined = currentActivity.itemId || undefined

    if (!subsidyRequestId) {
      toast.error('ID do subsídio não encontrado. Tente reabrir o modal.')
      return
    }
    if (!projectActivityId) {
      toast.error('ID da atividade não encontrado. Tente reabrir o modal.')
      return
    }

    const receiptType: 'pdf' | 'image' | 'invoice' = file.type === 'application/pdf'
      ? (file.name.toLowerCase().includes('invoice') || file.name.toLowerCase().includes('nota') ? 'invoice' : 'pdf')
      : 'image'

    // Open dialog so user can enter the document amount
    setUploadAmountDialog({
      isOpen: true,
      file,
      amount: '',
      projectActivityId,
      subsidyRequestItemId,
      receiptType,
    })
  }

  // Execute upload after user confirms amount in the dialog
  const confirmDocumentUpload = async () => {
    const { file, amount, projectActivityId, subsidyRequestItemId, receiptType } = uploadAmountDialog
    if (!file || !currentActivity) return

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      toast.error(modalT.uploadAmountDialog?.invalidAmount || 'Informe um valor válido para o documento.')
      return
    }

    setUploadAmountDialog(prev => ({ ...prev, isOpen: false }))

    try {
      await uploadReceipt(file, activeSubsidy.id, projectActivityId, {
        subsidyRequestItemId,
        type: receiptType,
        amount: parsedAmount,
      })
      const freshReceipts = await fetchReceipts(activeSubsidy.id)
      setReceipts(freshReceipts || [])
      setLastFetchTime(new Date())
      await refetchHistory()
    } catch {
      // error already toasted by the hook
    } finally {
      setUploadAmountDialog({ isOpen: false, file: null, amount: '', projectActivityId: '', subsidyRequestItemId: undefined, receiptType: 'pdf' })
    }
  }

  // Refund receipt upload handler
  const handleRefundReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const noteToSend = refundUploadNote.trim() || undefined

    try {
      await uploadRefundReceipt(file, activeSubsidy.id, {
        amount: activeSubsidy.refund_amount ? Number(activeSubsidy.refund_amount) : undefined,
        note: noteToSend,
      })
      setRefundUploadNote('')
      const freshReceipts = await fetchReceipts(activeSubsidy.id)
      setReceipts(freshReceipts || [])
      await refetchHistory()
    } catch {
      // error already toasted by the hook
    }
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full sm:w-[92vw] lg:w-[88vw] xl:w-[85vw] h-[100dvh] sm:h-[95vh] lg:h-[90vh] bg-white dark:bg-gray-900 sm:rounded-lg shadow-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border-0 sm:border border-gray-200 dark:border-gray-800">

        {/* Header */}
        <div className={cn(
          "border-b",
          (requestType === 'ADVANCE' || currentSubsidyStatus === 'waiting_refund')
            ? "border-yellow-300 dark:border-yellow-600"
            : "border-gray-200 dark:border-gray-800"
        )}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                {/* Request type label + project name */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    {requestType === 'ADVANCE'
                      ? (modalT.requestType?.advance || 'Advance request')
                      : requestType === 'WITHOUT_DOCUMENT'
                        ? (modalT.requestType?.withoutDocument || 'Request without documents')
                        : (modalT.requestType?.withDocument || 'Request with documents')}
                    {projectName && (
                      <> · <span className="normal-case font-normal text-gray-400 dark:text-gray-500">{projectName}</span></>
                    )}
                  </span>
                </div>
                {/* Description / title */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className={cn(
                    "text-base",
                    (requestType === 'ADVANCE' || currentSubsidyStatus === 'waiting_refund')
                      ? "font-bold text-yellow-600 dark:text-yellow-400"
                      : "font-semibold text-gray-900 dark:text-gray-100"
                  )}>
                    {subsidy.title}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {projectTranslations[i18n.language as keyof typeof projectTranslations]?.subsidy?.requestedOn || 'Requested on:'} {format(new Date(subsidy.requested_at), "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Chat toggle — mobile only */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden relative h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setIsMobileChatOpen(prev => !prev)}
                aria-label="Abrir histórico"
              >
                <MessageCircle className="w-4 h-4" />
                {newMessagesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[9px] rounded-full flex items-center justify-center">
                    {newMessagesCount}
                  </span>
                )}
              </Button>

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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex min-h-0">

          {/* Main Panel - Activities & Documents */}
          <div className={cn(
            "flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 transition-all duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                                currentSubsidyStatus === 'waiting_refund' && "bg-orange-50 dark:bg-orange-950/30 border-orange-500",
                                currentSubsidyStatus === 'waiting_documents' && "bg-orange-100 dark:bg-orange-950/40 border-orange-700"
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
                                  currentSubsidyStatus === 'waiting_refund' && "text-orange-600 dark:text-orange-400",
                                  currentSubsidyStatus === 'waiting_documents' && "text-orange-800 dark:text-orange-300"
                                )} />
                                <span className={cn(
                                  "text-xs sm:text-sm font-semibold truncate",
                                  currentSubsidyStatus === 'approved' && "text-green-700 dark:text-green-400",
                                  currentSubsidyStatus === 'rejected' && "text-red-700 dark:text-red-400",
                                  currentSubsidyStatus === 'in_review' && "text-blue-700 dark:text-blue-400",
                                  currentSubsidyStatus === 'pending' && "text-amber-700 dark:text-amber-400",
                                  currentSubsidyStatus === 'closed' && "text-gray-700 dark:text-gray-400",
                                  currentSubsidyStatus === 'advanced_closed' && "text-purple-700 dark:text-purple-400",
                                  currentSubsidyStatus === 'waiting_refund' && "text-orange-700 dark:text-orange-400",
                                  currentSubsidyStatus === 'waiting_documents' && "text-orange-900 dark:text-orange-300"
                                )}>
                                  {currentStatus.label}
                                </span>
                              </div>
                              <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            </button>
                          </DropdownMenuTrigger>
                          {canEditStatus && currentSubsidyStatus !== 'closed' && (
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

                              {/* Advanced Closed - Only for advance subsidies (legacy path) */}
                              {activeSubsidy?.is_for_advance && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChangeRequest('ADVANCED_CLOSED')}
                                  disabled={!canChangeStatus('advanced_closed')}
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-purple-600" />
                                  {t('subsidy.status.advancedClosed')}
                                </DropdownMenuItem>
                              )}

                              {/* Waiting for Documents - Only for advance subsidies (new preferred path) */}
                              {activeSubsidy?.is_for_advance && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChangeRequest('WAITING_DOCUMENTS')}
                                  disabled={!canChangeStatus('waiting_documents')}
                                >
                                  <FileText className="mr-2 h-4 w-4 text-orange-700" />
                                  <div className="flex flex-col">
                                    <span>{t('subsidy.status.waitingDocuments') || 'Waiting for Documents'}</span>
                                    <span className="text-xs text-muted-foreground">Advance paid — awaiting receipts</span>
                                  </div>
                                </DropdownMenuItem>
                              )}

                              {/* Request Refund - Available from APPROVED, ADVANCED_CLOSED or WAITING_DOCUMENTS */}
                              {(currentSubsidyStatus === 'approved' || currentSubsidyStatus === 'advanced_closed' || currentSubsidyStatus === 'waiting_documents') &&
                                !activeSubsidy.have_refund && (
                                  <DropdownMenuItem
                                    onClick={() => setShowRequestRefundModal(true)}
                                  >
                                    <DollarSign className="mr-2 h-4 w-4 text-orange-500" />
                                    {refundT.requestRefund}
                                  </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
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
                          {formatCurrency(
                            activeSubsidy.is_for_advance
                              ? activities.reduce((sum, act) => sum + act.requested_amount, 0)
                              : (activeSubsidy.requested_amount ?? subsidy.requested_amount)
                          )}
                        </span>
                        <Info className="w-3 h-3 text-gray-300 dark:text-gray-700 ml-auto flex-shrink-0 hidden sm:block" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="z-[70]">
                      <p className="text-xs">{modalT.tooltips.requestedAmount}</p>
                    </TooltipContent>
                  </Tooltip>


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
                      maxDisplay={5}
                      size="md"
                      showAddButton={false}
                      ownerUserId={responsibleUsers.find(u => u.isOwner)?.id}
                      coOwnerUserId={responsibleUsers.find(u => u.isCoOwner)?.id}
                    />
                  </div>
                </TooltipProvider>
              )}
            </div>

            {/* Refund Action Banner */}
            {activeSubsidy.have_refund && !activeSubsidy.refund_done && !activeSubsidy.refund_rejected && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <div className="flex items-start sm:items-center gap-3">
                  <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 sm:mt-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                      {t('subsidy.refundRequested') || 'Refund Requested'}
                    </h4>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-0.5 max-w-[400px]">
                      {(t('subsidy.refundAmountText') || 'A refund of {{amount}} was requested.').replace('{{amount}}', formatCurrency(activeSubsidy.refund_amount || 0))}
                      {activeSubsidy.refund_type === 'PARTIAL' ? ' (Parcial)' : ' (Total)'}
                    </p>
                  </div>
                </div>

                {isFinanceUser && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      onClick={() => setRejectRefundDialog({ isOpen: true, reason: '' })}
                      size="sm"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900"
                    >
                      {t('subsidy.rejectRefund') || 'Reject'}
                    </Button>
                    <Button
                      onClick={() => setShowConfirmRefundModal(true)}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-600 dark:hover:bg-orange-500"
                    >
                      {t('subsidy.confirmProcessed') || 'Confirm'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Show if refund is processed */}
            {activeSubsidy.have_refund && activeSubsidy.refund_done && !activeSubsidy.refund_rejected && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-500" />
                <span>
                  {(t('subsidy.refundProcessedMsg') || 'Refund of {{amount}} was successfully processed.').replace('{{amount}}', formatCurrency(activeSubsidy.refund_amount || 0))}
                  {activeSubsidy.refund_type === 'PARTIAL' ? ' (Parcial)' : ' (Total)'}
                </span>
              </div>
            )}

            {/* Show if refund is rejected */}
            {activeSubsidy.have_refund && activeSubsidy.refund_rejected && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400">
                <Ban className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-500" />
                <span>
                  {(t('subsidy.refundRejectedMsg') || 'Refund of {{amount}} was rejected.').replace('{{amount}}', formatCurrency(activeSubsidy.refund_amount || 0))}
                  {activeSubsidy.refund_type === 'PARTIAL' ? ' (Parcial)' : ' (Total)'}
                </span>
              </div>
            )}

            {/* Request type info banner */}
            <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
              <span>
                {requestType === 'ADVANCE'
                  ? (modalT.requestType?.info?.advance || 'Advance payment request — document upload is optional.')
                  : requestType === 'WITHOUT_DOCUMENT'
                    ? (modalT.requestType?.info?.withoutDocument || 'This request was submitted without supporting documents.')
                    : (modalT.requestType?.info?.withDocument || 'This request requires activity documents to be linked and validated.')}
              </span>
            </div>


            {/* Activities Navigation — always shown for advance subsidies; shown for others when activities exist */}
            {(activities.length > 0 || subsidy.is_for_advance) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t('subsidy.activities')}
                  </h3>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {activities.map((activity, index) => {
                    const docStatus = getActivityDocumentStatus(activity)
                    const canUnlink = canLinkActivity && (isProjectOwner || canValidateDocuments)
                    const isConfirmingDelete = confirmDeleteActivityId === activity.id
                    return (
                      <div
                        key={activity.id || `activity-${index}`}
                        className="flex-shrink-0 flex items-stretch gap-1"
                      >
                        {/* Activity Tab */}
                        <button
                          onClick={() => {
                            setSelectedActivityIndex(index)
                            // Single-click clears the delete confirmation for this tab
                            if (isConfirmingDelete) setConfirmDeleteActivityId(null)
                          }}
                          onDoubleClick={(e) => {
                            if (!canUnlink) return
                            e.preventDefault()
                            e.stopPropagation()
                            setConfirmDeleteActivityId(prev => prev === activity.id ? null : activity.id)
                          }}
                          className={cn(
                            "px-4 py-2.5 rounded-md border text-left transition-all duration-200 relative select-none",
                            isConfirmingDelete
                              ? "border-red-300 dark:border-red-700 bg-red-50/40 dark:bg-red-950/10"
                              : selectedActivityIndex === index
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
                            isConfirmingDelete
                              ? "text-red-700 dark:text-red-400"
                              : selectedActivityIndex === index
                                ? "text-white dark:text-gray-900"
                                : "text-gray-900 dark:text-gray-100"
                          )}>
                            {activity.name}
                          </p>
                          <p className={cn(
                            "text-xs mt-1",
                            isConfirmingDelete
                              ? "text-red-500 dark:text-red-500"
                              : selectedActivityIndex === index
                                ? "text-gray-200 dark:text-gray-700"
                                : "text-gray-500 dark:text-gray-400"
                          )}>
                            {formatCurrency(activity.requested_amount)}
                          </p>
                        </button>

                        {/* Delete confirmation box — slides in on double-click */}
                        {canUnlink && isConfirmingDelete && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setConfirmDeleteActivityId(null)
                              handleUnlinkActivity(activity.id)
                            }}
                            className="flex items-center justify-center w-10 flex-shrink-0 rounded-md border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300 transition-colors animate-in slide-in-from-left-2 duration-200"
                            title="Confirmar exclusão da atividade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )
                  })}

                  {/* Add activity button — same height as tabs, inline with them */}
                  {subsidy.is_for_advance && canLinkActivity && (
                    <button
                      type="button"
                      onClick={handleOpenLinkActivityDialog}
                      className="flex-shrink-0 flex items-center justify-center px-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-transparent text-gray-400 dark:text-gray-500 hover:border-gray-500 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                      title={t('subsidyRequest.advance.linkedActivitiesTitle') || 'Link Activity'}
                      style={{ minHeight: '52px' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}

                  {/* Empty state — no activities linked */}
                  {activities.length === 0 && (
                    <div className="flex-1 rounded-md border border-dashed border-gray-200 dark:border-gray-800 py-7 px-4 flex flex-col items-center justify-center gap-2 text-center min-w-[200px]">
                      <FileText className="w-5 h-5 text-gray-300 dark:text-gray-700" />
                      <div className="space-y-0.5">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('subsidyRequest.advance.noActivitiesLinked') || 'Nenhuma atividade vinculada'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-600">
                          {canLinkActivity
                            ? (t('subsidyRequest.advance.linkActivityHint') || 'Use o + para vincular atividades.')
                            : (t('subsidyRequest.advance.noActivitiesStatus') || 'Nenhuma atividade registrada.')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Activity Details — shown for all types (upload button + document list) */}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('table.totalRequested')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(currentActivity.requested_amount)}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {t('subsidy.documents')}
                    </h5>
                    {currentSubsidyStatus !== 'closed' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={receiptsUploading}
                            onClick={() => uploadFileInputRef.current?.click()}
                            className="h-6 px-2 text-[10px] gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {receiptsUploading ? (
                              <div className="w-3 h-3 border border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            {modalT.requestType?.uploadDocument || 'Add'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="z-[80]">
                          <p className="text-xs">{modalT.requestType?.uploadDocument || 'Add document to this activity'}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={uploadFileInputRef}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                  />


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
                                    {/* Validate/Reject Buttons — canValidateDocuments is the sole gate (no extra WithPermission) */}
                                    {canValidateDocuments ? (
                                      <>
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
                                      onClick={() => setPreviewDocument(doc)}
                                      className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="z-[80]">
                                    <p className="text-xs">Visualizar documento</p>
                                  </TooltipContent>
                                </Tooltip>

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

                                {canDeleteDocuments && (doc.is_validated === undefined || canValidateDocuments || isFinanceUser) && currentSubsidyStatus !== 'closed' && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={async () => {
                                          try {
                                            await deleteReceipt(doc.id)
                                            const fresh = await fetchReceipts(activeSubsidy.id)
                                            setReceipts(fresh || [])
                                          } catch { /* toasted by hook */ }
                                        }}
                                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="z-[80]">
                                      <p className="text-xs">{t('common.delete') || 'Excluir'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
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

          {/* ── Desktop center panel toggle ─────────────────────────── */}
          <div className="hidden lg:flex flex-col items-center justify-center w-5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="flex items-center justify-center w-5 h-8 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-colors"
              aria-label="Toggle history"
            >
              {isSidebarOpen
                ? <ChevronRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                : <ChevronLeft className="w-3 h-3 text-gray-500 dark:text-gray-400" />}
            </button>
          </div>

          {/* Collapsible Sidebar - Chat & History */}
          <SubsidyChatPanel
            isSidebarOpen={isSidebarOpen}
            isMobileChatOpen={isMobileChatOpen}
            onMobileChatClose={() => setIsMobileChatOpen(false)}
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

        {/* Mobile Chat Toggle - Bottom Bar */}
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            type="button"
            onClick={() => setIsMobileChatOpen(prev => !prev)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Abrir histórico"
          >
            <ChevronUp className="w-4 h-4" />
            <span>{t('subsidy.history') || 'Histórico'}</span>
            {newMessagesCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[9px] rounded-full">
                {newMessagesCount}
              </span>
            )}
          </button>
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
      {/* ── Link Activity Dialog (ADVANCE subsidies) — reuses SelectActivitiesModal ── */}
      <SelectActivitiesModal
        isOpen={showLinkActivityDialog}
        onClose={() => setShowLinkActivityDialog(false)}
        activities={availableActivitiesToLink}
        onConfirm={handleLinkActivities}
        filterSubsidized={false}
        subsidizedActivityIds={Array.from(linkedActivityIds) as string[]}
        title={t('subsidyRequest.advance.linkActivityTitle') || 'Vincular Atividades'}
        description={t('subsidyRequest.advance.linkActivityDescription') || 'Selecione as atividades do projeto para vincular a este adiantamento.'}
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

      {/* ── Upload Document Amount Dialog ──────────────────────────────────── */}
      <Dialog
        open={uploadAmountDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) setUploadAmountDialog({ isOpen: false, file: null, amount: '', projectActivityId: '', subsidyRequestItemId: undefined, receiptType: 'pdf' })
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{modalT.uploadAmountDialog?.title || 'Valor do documento'}</DialogTitle>
            <DialogDescription>
              {(modalT.uploadAmountDialog?.description || 'Informe o valor referente ao documento {{name}}.')
                .replace('{{name}}', uploadAmountDialog.file?.name || '')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="upload-doc-amount" className="text-sm">
                {modalT.uploadAmountDialog?.amountLabel || 'Valor'}
                {' '}({selectedCurrency.code})
                {' '}<span className="text-red-500">*</span>
              </Label>
              <Input
                id="upload-doc-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder={modalT.uploadAmountDialog?.placeholder || '0,00'}
                value={uploadAmountDialog.amount}
                onChange={e => setUploadAmountDialog(prev => ({ ...prev, amount: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') confirmDocumentUpload() }}
                autoFocus
                className="h-9"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUploadAmountDialog({ isOpen: false, file: null, amount: '', projectActivityId: '', subsidyRequestItemId: undefined, receiptType: 'pdf' })}
            >
              {modalT.uploadAmountDialog?.cancel || 'Cancelar'}
            </Button>
            <Button
              size="sm"
              onClick={confirmDocumentUpload}
              disabled={!uploadAmountDialog.amount || receiptsUploading}
            >
              {receiptsUploading
                ? (modalT.uploadAmountDialog?.submitting || 'Enviando...')
                : (modalT.uploadAmountDialog?.submit || 'Enviar documento')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Document Preview Dialog ─────────────────────────────────────────── */}
      {previewDocument && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
          onClick={() => setPreviewDocument(null)}
        >
          <div
            className="relative flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ width: 'min(92vw, 960px)', height: 'min(90vh, 820px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {['JPG', 'PNG'].includes(previewDocument.file_type) ? (
                  <ImageIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {previewDocument.file_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{previewDocument.file_type}</span>
                    <span className="text-[10px] text-gray-400">·</span>
                    <span className="text-[10px] text-gray-500">{getDocumentTypeLabel(previewDocument.document_type)}</span>
                    {previewDocument.amount > 0 && (
                      <>
                        <span className="text-[10px] text-gray-400">·</span>
                        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                          {formatCurrency(previewDocument.amount)}
                        </span>
                      </>
                    )}
                    {/* Validation badge */}
                    {previewDocument.is_validated === true && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-green-100 border-green-400 text-green-700">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                        {t('subsidy.status.approved')}
                      </Badge>
                    )}
                    {previewDocument.is_validated === false && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-100 border-red-400 text-red-700">
                        <XCircle className="w-2.5 h-2.5 mr-0.5" />
                        {t('subsidy.status.rejected')}
                      </Badge>
                    )}
                    {previewDocument.is_validated === undefined && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-100 border-amber-400 text-amber-700">
                        <Clock className="w-2.5 h-2.5 mr-0.5" />
                        {t('subsidy.status.pending')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(previewDocument.file_url, '_blank')}
                      className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="z-[110]">
                    <p className="text-xs">Abrir em nova aba</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(previewDocument)}
                      className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="z-[110]">
                    <p className="text-xs">{t('subsidy.downloadDocument')}</p>
                  </TooltipContent>
                </Tooltip>
                <button
                  type="button"
                  onClick={() => setPreviewDocument(null)}
                  className="ml-1 inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-950 relative flex flex-col">
              {/* ── Google Drive: always embed via /preview iframe ── */}
              {isGDriveUrl(previewDocument.file_url) ? (
                <div className="flex flex-col w-full h-full">
                  <iframe
                    src={getEmbedUrl(previewDocument.file_url)}
                    className="w-full flex-1 border-0"
                    title={previewDocument.file_name}
                    allow="autoplay"
                  />
                  <div className="flex items-center justify-center gap-1.5 py-1.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-500">
                    <Info className="w-3 h-3 flex-shrink-0" />
                    <span>Hospedado no Google Drive.</span>
                    <button
                      type="button"
                      className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700"
                      onClick={() => window.open(previewDocument.file_url, '_blank')}
                    >
                      Abrir em nova aba
                    </button>
                    <span>se não carregar.</span>
                  </div>
                </div>
              ) : previewDocument.file_type === 'PDF' ? (
                <iframe
                  src={`${previewDocument.file_url}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0"
                  title={previewDocument.file_name}
                />
              ) : ['JPG', 'PNG'].includes(previewDocument.file_type) ? (
                <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getDirectImageUrl(previewDocument.file_url)}
                    alt={previewDocument.file_name}
                    className="max-w-full max-h-full object-contain rounded shadow-md"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      target.nextElementSibling?.removeAttribute('hidden')
                    }}
                  />
                  <div hidden className="text-center text-gray-500 dark:text-gray-400 space-y-2">
                    <ImageIcon className="w-12 h-12 mx-auto opacity-30" />
                    <p className="text-sm">Não foi possível carregar a imagem.</p>
                    <Button variant="outline" size="sm" onClick={() => window.open(previewDocument.file_url, '_blank')}>
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Abrir em nova aba
                    </Button>
                  </div>
                </div>
              ) : (
                /* DOC / OTHER — show fallback with open-in-tab option */
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
                  <FileText className="w-16 h-16 opacity-20" />
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Preview não disponível para {previewDocument.file_type}
                    </p>
                    <p className="text-xs text-gray-400">
                      Faça o download ou abra em uma nova aba para visualizar.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(previewDocument.file_url, '_blank')}>
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Abrir em nova aba
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(previewDocument)}>
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      {t('subsidy.downloadDocument')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Refund Dialog ──────────────────────────────────── */}
      <Dialog
        open={rejectRefundDialog.isOpen}
        onOpenChange={(open) => !open && setRejectRefundDialog({ isOpen: false, reason: '' })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('subsidy.rejectRefundTitle') || 'Reject Refund Request'}
            </DialogTitle>
            <DialogDescription>
              {t('subsidy.rejectRefundDesc') || 'Please provide a reason for rejecting this refund request. This will be sent to the requester.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="refund-rejection-reason" className="text-sm">
                {t('subsidy.rejectionReason') || 'Reason'} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="refund-rejection-reason"
                value={rejectRefundDialog.reason}
                onChange={(e) => setRejectRefundDialog(prev => ({ ...prev, reason: e.target.value }))}
                placeholder={t('subsidy.rejectionReasonPlaceholder') || 'Describe why the refund is being rejected...'}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectRefundDialog({ isOpen: false, reason: '' })}
              disabled={isRejectingRefund}
              size="sm"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleRejectRefundConfirmed}
              disabled={isRejectingRefund || !rejectRefundDialog.reason.trim()}
              size="sm"
              variant="destructive"
            >
              {isRejectingRefund ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('subsidy.confirmReject') || 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
