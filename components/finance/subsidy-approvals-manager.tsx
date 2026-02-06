"use client"

import React, { useState, useMemo } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  DollarSign,
  RefreshCw,
  Eye,
  FileText,
  LayoutGrid,
  List,
  Building,
  User,
  Calendar,
  TrendingUp,
  Settings,
  Info,
  Flag,
  Maximize2,
  X,
  Fullscreen
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { UseTable } from "@/components/ui/use-table"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { AnalyticsGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { KanbanBoard, KanbanGroup, KanbanItem, KanbanAction } from "@/components/ui/kanban-board"
import { ViewSubsidyModal } from "@/components/modals/project/view-subsidy-modal"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { ExpandedViewModal } from "@/components/shared/expanded-view-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useCurrency } from "@/contexts/currency-context"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { subsidyApprovalsTranslations } from "@/lib/translations/subsidy-approvals"
import { ChartHeader } from "@/components/charts/chart-header"

// Import Charts
import { 
  RequestsOverTimeChart, 
  StatusOverviewChart, 
  RequestsByDepartmentChart 
} from "@/components/finance/charts"

// Charts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer
} from "recharts"
import { APPROVE_SUBSIDY_REQUEST, REJECT_SUBSIDY_REQUEST, UPDATE_SUBSIDY_REQUEST } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"
import { GET_ALL_SUBSIDY_STATUSES } from "@/graphql/queries/SUBSIDY_STATUS_QUERIES"
import { InlinePrivacyToggle, PrivacyWrapper } from "@/components/shared/privacy-wrapper"
import { PrivacyConfig } from "@/contexts/privacy-context"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AdvanceSubsidyBadge } from "@/components/ui/advance-subsidy-badge"

interface SubsidyRequest {
  id: string
  title: string
  institution_name: string
  church_name?: string
  requested_amount: number
  approved_amount?: number
  status: "pending" | "in_review" | "approved" | "closed" | "rejected" | "advanced_closed"
  requested_at: string
  reviewed_at?: string
  reviewed_by?: string
  activities_count: number
  total_budget: number
  priority: "low" | "medium" | "high"
  notes?: string
  items?: Array<{
    id: string
    activity_id: string
    activity_name: string
    requested_amount: number
    approved_amount: number
    budget_amount: number
    notes?: string
  }>
  department_name?: string
  receipts?: Array<{
    id: string
    is_validated: boolean
  }>
  is_for_advance?: boolean
  advance_amount?: number
}

interface SubsidyApprovalsManagerProps {
  context?: string
  entityId?: string
  isLoading?: boolean
  onRefresh?: () => void
  title?: string
  description?: string
  showCharts?: boolean
  showKPICards?: boolean
  subsidyData?: any
  analyticsData?: any
  refetchSubsidies?: () => Promise<any>
  privacyConfigs?: {
    totalRequests?: PrivacyConfig
    pendingReview?: PrivacyConfig
    totalRequested?: PrivacyConfig
    totalApproved?: PrivacyConfig
    approvalRate?: PrivacyConfig
    tableMonetaryValues?: PrivacyConfig
    kanbanMonetaryValues?: PrivacyConfig
    byDepartmentChart?: PrivacyConfig
    overTimeChart?: PrivacyConfig
    statusOverviewChart?: PrivacyConfig
  }
}

export function SubsidyApprovalsManager({
  context = "general",
  entityId,
  isLoading = false,
  onRefresh,
  showCharts = true,
  showKPICards = true,
  subsidyData,
  analyticsData,
  refetchSubsidies,
  privacyConfigs
}: SubsidyApprovalsManagerProps) {
  const { t, i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const translations = subsidyApprovalsTranslations[i18n.language as keyof typeof subsidyApprovalsTranslations] || subsidyApprovalsTranslations.en
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSubsidy, setSelectedSubsidy] = useState<SubsidyRequest | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [isExpandedView, setIsExpandedView] = useState(false)

  // Fetch all subsidy statuses for ID resolution
  const { data: statusesData } = useQuery(GET_ALL_SUBSIDY_STATUSES)

  // Mutations for approve/reject
  const [approveSubsidyMutation] = useMutation(APPROVE_SUBSIDY_REQUEST, {
    onCompleted: async () => {
      toast.success(translations.toasts.approveSuccess)
      if (refetchSubsidies) {
        await refetchSubsidies()
      }
    },
    onError: (err) => {
      let ext = (err.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (err.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (err.networkError as any).result.errors[0].extensions;
      }
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
          toast.error(translations.toasts?.statusClosed || "Status Closed cannot be changed");
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
          toast.error(translations.toasts?.inReviewToClosed || "Cannot close In Review requests");
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
          toast.error(translations.toasts?.mustBeFinal || "Must be Approved or Rejected to Close");
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
          toast.error(translations.toasts?.documentsPending || "All documents must be validated first");
      } else if (errorCode === 'ONLY_FINANCIAL_CAN_CLOSE') {
          toast.error(translations.toasts?.onlyFinancialCanClose || "Only users with the Financial Manager role can close subsidy requests");
      } else {
        toast.error(translations.toasts.approveError.replace('{{message}}', err.message))
      }
    }
  })

  const [rejectSubsidyMutation] = useMutation(REJECT_SUBSIDY_REQUEST, {
    onCompleted: async () => {
      toast.success(translations.toasts.rejectSuccess)
      if (refetchSubsidies) {
        await refetchSubsidies()
      }
    },
    onError: (err) => {
      let ext = (err.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (err.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (err.networkError as any).result.errors[0].extensions;
      }
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
          toast.error(translations.toasts?.statusClosed || "Status Closed cannot be changed");
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
          toast.error(translations.toasts?.inReviewToClosed || "Cannot close In Review requests");
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
          toast.error(translations.toasts?.mustBeFinal || "Must be Approved or Rejected to Close");
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
          toast.error(translations.toasts?.documentsPending || "All documents must be validated first");
      } else if (errorCode === 'ONLY_FINANCIAL_CAN_CLOSE') {
          toast.error(translations.toasts?.onlyFinancialCanClose || "Only users with the Financial Manager role can close subsidy requests");
      } else {
        toast.error(translations.toasts.rejectError.replace('{{message}}', err.message))
      }
    }
  })

  const [updateSubsidyMutation] = useMutation(UPDATE_SUBSIDY_REQUEST, {
    onCompleted: async () => {
      toast.success(translations.toasts.statusUpdateSuccess)
      if (refetchSubsidies) {
        await refetchSubsidies()
      }
    },
    onError: (err) => {
      let ext = (err.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (err.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (err.networkError as any).result.errors[0].extensions;
      }
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      if (errorCode === 'STATUS_IS_CLOSED') {
          toast.error(translations.toasts?.statusClosed || "Status Closed cannot be changed");
      } else if (errorCode === 'INVALID_TRANSITION_IN_REVIEW_TO_CLOSED') {
          toast.error(translations.toasts?.inReviewToClosed || "Cannot close In Review requests");
      } else if (errorCode === 'INVALID_TRANSITION_FINAL_STATE') {
          toast.error(translations.toasts?.mustBeFinal || "Must be Approved or Rejected to Close");
      } else if (errorCode === 'DOCUMENTS_NOT_VALIDATED') {
          toast.error(translations.toasts?.documentsPending || "All documents must be validated first");
      } else if (errorCode === 'ONLY_FINANCIAL_CAN_CLOSE') {
          toast.error(translations.toasts?.onlyFinancialCanClose || "Only users with the Financial Manager role can close subsidy requests");
      } else {
        toast.error(translations.toasts.statusUpdateError.replace('{{message}}', err.message))
      }
    }
  })

  // Helper function to get status ID by name from the statuses query
  const getStatusIdByName = (statusName: string): string | null => {
    if (!statusesData?.subsidyStatuses) return null
    
    const status = statusesData.subsidyStatuses.find((s: any) => 
      s.name?.toUpperCase() === statusName.toUpperCase()
    )
    return status?.id || null
  }

  // States for confirmation dialogs
  const [confirmationDialog, setConfirmationDialog] = useState<{ 
      isOpen: boolean; 
      action: 'approve' | 'reject' | 'close' | 'status_change'; 
      itemId: string;
      status?: string 
  }>({ isOpen: false, action: 'status_change', itemId: '' })
  
  const [rejectionDialog, setRejectionDialog] = useState<{ 
      isOpen: boolean; 
      itemId: string; 
      reason: string 
  }>({ isOpen: false, itemId: '', reason: '' })

  const getStatusChangeError = (subsidy: SubsidyRequest, to: string): string | null => {
    const from = subsidy.status

    // Rule: Closed status cannot be changed to anything else
    if (from === 'closed') return translations.toasts?.statusClosed || "Status Closed cannot be changed"
    
    // Rule: To Closed is allowed from Approved or Rejected or Advanced Closed
    if (to === 'closed') {
      if (from === 'in_review') return translations.toasts?.inReviewToClosed || "Cannot close In Review requests"
      // Only allowed from approved, rejected or advanced_closed
      if (from !== 'approved' && from !== 'rejected' && from !== 'advanced_closed') return translations.toasts?.mustBeFinal || "Must be Approved or Rejected to Close"
    }
    
    // Rule: Advance subsidies logic
    if (subsidy.is_for_advance) {
        if (from === 'approved') {
            // Can go to advanced_closed
            if (to === 'advanced_closed') return null
            // Cannot go to closed directly (must go to advanced_closed first)
            if (to === 'closed') return translations.toasts?.mustBeAdvancedClosed || "Adv. Subsidies must be Advanced Closed first"
        }
        if (from === 'advanced_closed') {
            // Can go to closed
            if (to === 'closed') return null
            // Cannot go back to approved
            return translations.toasts?.finalState || "Advanced Closed can only change to Closed"
        }
    }

    // Rule: If Approved or Rejected, can ONLY go to Closed (for normal subsidies)
    if (from === 'approved' || from === 'rejected') {
      if (to !== 'closed') return translations.toasts?.finalState || "Can only change to Closed"
    }

    // Rule: Cannot change to Approved, Closed, Rejected unless all documents are validated
    // Note: Advance subsidies don't have documents usually, but if they did, we'd check them.
    // However, for ADVANCE request creation, no docs required.
    // If user added docs later, we might want to validate.
    if (['approved', 'closed', 'rejected', 'advanced_closed'].includes(to)) {
       const hasPending = (subsidy.receipts || []).some(r => !r.is_validated);
       if (hasPending) {
           return translations.toasts?.documentsPending || "All documents must be validated first"
       }
    }
    
    return null
  }

  // Transform backend data to component format
  const mapBackendStatus = (statusName: string): SubsidyRequest['status'] => {
    const statusMap: Record<string, SubsidyRequest['status']> = {
      'PENDING': 'pending',
      'IN_REVIEW': 'in_review',
      'APPROVED': 'approved',
      'REJECTED': 'rejected',
      'CLOSED': 'closed',
      'ADVANCED_CLOSED': 'advanced_closed'
    }
    return statusMap[statusName?.toUpperCase()] || 'pending'
  }

  const subsidyRequests: SubsidyRequest[] = useMemo(() => {
    if (!subsidyData?.subsidyRequests) return []
    
    return subsidyData.subsidyRequests.map((request: any) => ({
      id: request.id,
      title: request.description || request.project?.title || translations.defaults.untitledRequest,
      institution_name: request.institution?.name || '',
      church_name: request.church?.name,
      requested_amount: parseFloat(request.total_budget) || 0,
      approved_amount: request.approved_amount ? parseFloat(request.approved_amount) : undefined,
      status: mapBackendStatus(request.subsidy_status?.name),
      requested_at: request.created_at,
      reviewed_at: request.approved_at,
      reviewed_by: request.approved_by,
      activities_count: request.items?.length || 0,
      total_budget: parseFloat(request.total_budget) || 0,
      priority: 'medium' as const, // Default priority
      notes: request.rejection_reason,
      items: request.items?.map((item: any) => ({
        id: item.id,
        activity_id: item.project_activity_id,
        activity_name: item.project_activity?.name || 'Unknown',
        requested_amount: parseFloat(item.requested_amount) || 0,
        approved_amount: parseFloat(item.approved_amount) || 0,
        budget_amount: parseFloat(item.project_activity?.budget_amount) || 0,
        notes: item.notes
      })) || [],
      department_name: request.department?.name || translations.defaults.otherDepartment,
      is_for_advance: request.is_for_advance,
      advance_amount: request.advance_amount ? parseFloat(request.advance_amount) : undefined
    }))
  }, [subsidyData])

  // KPI Data - Calculated directly from subsidyRequests (same source as table/kanban)
  const kpiData = useMemo(() => {
    // Calculate from actual subsidy requests
    const totalRequests = subsidyRequests.length
    const pendingRequests = subsidyRequests.filter(r => r.status === 'pending').length
    const inReviewRequests = subsidyRequests.filter(r => r.status === 'in_review').length
    const approvedRequests = subsidyRequests.filter(r => r.status === 'approved').length
    const closedRequests = subsidyRequests.filter(r => r.status === 'closed').length
    const rejectedRequests = subsidyRequests.filter(r => r.status === 'rejected').length
    
    const totalRequested = subsidyRequests.reduce((sum, r) => sum + r.requested_amount, 0)
    const totalApproved = subsidyRequests
      .filter(r => r.status === 'approved' || r.status === 'closed')
      .reduce((sum, r) => sum + (r.approved_amount || r.requested_amount), 0)
    
    const approvalRate = totalRequests > 0 
      ? Math.round(((approvedRequests + closedRequests) / totalRequests) * 100) 
      : 0
    
    return {
      totalRequests,
      pendingRequests,
      inReviewRequests,
      approvedRequests,
      closedRequests,
      rejectedRequests,
      totalRequested,
      totalApproved,
      approvalRate
    }
  }, [subsidyRequests])

  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_requests",
      title: translations.kpis.totalRequests.title,
      value: kpiData.totalRequests,
      icon: FileText,
      subtitle: translations.kpis.totalRequests.subtitle,
      trend: {
        value: 15,
        isPositive: true,
        label: translations.kpis.trend.vsLastMonth
      },
      privacyConfig: privacyConfigs?.totalRequests,
      headerAction: privacyConfigs?.totalRequests ? (
        <InlinePrivacyToggle 
          config={privacyConfigs.totalRequests}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
    },
    {
      id: "pending_review",
      title: translations.kpis.pendingReview.title,
      value: kpiData.pendingRequests + kpiData.inReviewRequests,
      icon: Clock,
      subtitle: translations.kpis.pendingReview.subtitle,
      trend: {
        value: 8,
        isPositive: false,
        label: translations.kpis.trend.vsLastMonth
      },
      privacyConfig: privacyConfigs?.pendingReview,
      headerAction: privacyConfigs?.pendingReview ? (
        <InlinePrivacyToggle 
          config={privacyConfigs.pendingReview}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
    },
    {
      id: "total_requested",
      title: translations.kpis.totalRequested.title,
      value: formatCurrency(kpiData.totalRequested),
      icon: DollarSign,
      subtitle: translations.kpis.totalRequested.subtitle,
      trend: {
        value: 12,
        isPositive: true,
        label: translations.kpis.trend.vsLastMonth
      },
      privacyConfig: privacyConfigs?.totalRequested,
      headerAction: privacyConfigs?.totalRequested ? (
        <InlinePrivacyToggle 
          config={privacyConfigs.totalRequested}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
    },
    {
      id: "total_approved",
      title: translations.kpis.totalApproved.title,
      value: formatCurrency(kpiData.totalApproved),
      icon: CheckCircle,
      subtitle: translations.kpis.totalApproved.subtitle,
      trend: {
        value: 10,
        isPositive: true,
        label: translations.kpis.trend.vsLastMonth
      },
      privacyConfig: privacyConfigs?.totalApproved,
      headerAction: privacyConfigs?.totalApproved ? (
        <InlinePrivacyToggle 
          config={privacyConfigs.totalApproved}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
    },
    {
      id: "approval_rate",
      title: translations.kpis.approvalRate.title,
      value: `${kpiData.approvalRate}%`,
      icon: TrendingUp,
      subtitle: translations.kpis.approvalRate.subtitle,
      trend: {
        value: 5,
        isPositive: true,
        label: translations.kpis.trend.vsLastMonth
      },
      privacyConfig: privacyConfigs?.approvalRate,
      headerAction: privacyConfigs?.approvalRate ? (
        <InlinePrivacyToggle 
          config={privacyConfigs.approvalRate}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
    }
  ], [kpiData, formatCurrency, translations, privacyConfigs])

  // Chart data - Calculated directly from subsidyRequests (same source as table/kanban)
  const chartData = useMemo(() => {
    // 1. By Status (StatusOverviewChart)
    const statusColorMap: Record<string, string> = {
      'pending': '#f59e0b',
      'in_review': '#3b82f6',
      'approved': '#10b981',
      'closed': '#059669',
      'rejected': '#ef4444',
      'advanced_closed': '#7c3aed'
    }
    
    const statusLabelMap: Record<string, string> = {
      'pending': 'Pending',
      'in_review': 'In Review',
      'approved': 'Approved',
      'closed': 'Closed',
      'rejected': 'Rejected',
      'advanced_closed': 'Advanced Closed'
    }
    
    // Count requests by status from actual data
    const statusCounts: Record<string, number> = {
      'pending': 0,
      'in_review': 0,
      'approved': 0,
      'closed': 0,
      'rejected': 0,
      'advanced_closed': 0
    }
    
    subsidyRequests.forEach(request => {
      if (statusCounts[request.status] !== undefined) {
        statusCounts[request.status]++
      }
    })
    
    const byStatusData = Object.keys(statusColorMap).map(statusKey => ({
      status: statusLabelMap[statusKey],
      count: statusCounts[statusKey] || 0,
      fill: statusColorMap[statusKey]
    }))

    // 2. By Month (RequestsOverTimeChart)
    // Group requests by month from created_at
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December']
    const monthData: Record<string, any> = {}
    
    // Initialize all months with 0 counts
    monthNames.forEach((month, index) => {
      const quarter = Math.floor(index / 3) + 1
      monthData[month] = {
        month,
        pending: 0,
        in_review: 0,
        approved: 0,
        closed: 0,
        rejected: 0,
        advanced_closed: 0,
        quarter
      }
    })
    
    // Count requests by month and status
    subsidyRequests.forEach(request => {
      const date = new Date(request.requested_at)
      const monthName = monthNames[date.getMonth()]
      if (monthData[monthName] && request.status) {
        const statusKey = request.status as 'pending' | 'in_review' | 'approved' | 'closed' | 'rejected' | 'advanced_closed'
        monthData[monthName][statusKey]++
      }
    })
    
    const byMonthData = Object.values(monthData)

    // 3. By Department (RequestsByDepartmentChart)
    // Group by department with EXACT created_at date
    const dateMap: Record<string, any> = {}
    
    subsidyRequests.forEach((request, index) => {
      const createdDate = new Date(request.requested_at)
      const dateKey = createdDate.toISOString().split('T')[0]
      const dept = request.department_name || 'Other'
      const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][createdDate.getMonth()]
      
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey, month: monthAbbr }
      }
      
      if (!dateMap[dateKey][dept]) {
        dateMap[dateKey][dept] = 0
      }
      dateMap[dateKey][dept] += request.requested_amount
    })
    
    const byDepartmentData = Object.values(dateMap)

    return {
      byStatus: byStatusData,
      byMonth: byMonthData,
      byDepartment: byDepartmentData
    }
  }, [subsidyRequests])


  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(translations.toasts.refreshing)
    
    try {
      if (refetchSubsidies) {
        await refetchSubsidies()
      }
      if (onRefresh) {
        await onRefresh()
      }
      toast.success(translations.toasts.refreshSuccess, { duration: 2000 })
    } catch (error) {
      toast.error(translations.toasts.refreshError)
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleViewSubsidy = (subsidyId: string) => {
    const subsidy = subsidyRequests.find(r => r.id === subsidyId)
    if (subsidy) {
      setSelectedSubsidy(subsidy)
      setIsViewModalOpen(true)
    }
  }

  // Executors
  const executeApprove = async (id: string) => {
    const subsidy = subsidyRequests.find(r => r.id === id)
    if (!subsidy) return
    try {
        await approveSubsidyMutation({ variables: { id, approved_amount: subsidy.requested_amount } })
    } catch (e) {}
  }

  const executeReject = async (id: string, reason: string) => {
      try {
          await rejectSubsidyMutation({ variables: { id, rejection_reason: reason } })
      } catch (e) {}
  }

  const executeStatusUpdate = async (id: string, status: string) => {
      const statusId = getStatusIdByName(status.toUpperCase())
      if (!statusId) return
      try {
          await updateSubsidyMutation({ variables: { id, data: { subsidy_status_id: statusId } } })
      } catch (e) {}
  }

  const handleApprove = async (subsidyId: string) => {
    const request = subsidyRequests.find(r => r.id === subsidyId)
    if (!request) return
    
    const error = getStatusChangeError(request, 'approved')
    if (error) {
         toast.error(error)
         return
    }
    setConfirmationDialog({ isOpen: true, action: 'approve', itemId: subsidyId })
  }

  const handleReject = async (subsidyId: string) => {
    const request = subsidyRequests.find(r => r.id === subsidyId)
    if (!request) return
    
    const error = getStatusChangeError(request, 'rejected')
    if (error) {
         toast.error(error)
         return
    }
    setRejectionDialog({ isOpen: true, itemId: subsidyId, reason: translations.defaults.rejectionReason || '' })
  }

  const handleMarkInReview = async (subsidyId: string) => {
     handleKanbanItemMove(subsidyId, 'pending', 'in_review')
  }

  // Refactored Kanban Move Handler
  const handleKanbanItemMove = async (itemId: string, fromGroupId: string, toGroupId: string) => {
    const request = subsidyRequests.find(r => r.id === itemId)
    if (!request) return

    // Validar regras de negócio
    const error = getStatusChangeError(request, toGroupId)
    if (error) {
        toast.error(error)
        // Note: Kanban might have optimistically moved the item. A refresh usually fixes this, 
        // or a library specific revert. Since we don't have direct revert access here easily without library specifics,
        // we rely on the component re-render from props/refresh.
        return
    }

    if (toGroupId === 'approved') {
        setConfirmationDialog({ isOpen: true, action: 'approve', itemId })
    } else if (toGroupId === 'rejected') {
        setRejectionDialog({ isOpen: true, itemId, reason: '' })
    } else if (toGroupId === 'closed') {
        setConfirmationDialog({ isOpen: true, action: 'close', itemId })
    } else {
        // Direct update for statuses that don't need confirmation (like Pending <-> In Review)
        executeStatusUpdate(itemId, toGroupId)
    }
  }

  // Status configuration
  const statusConfig: Record<SubsidyRequest["status"], { 
    label: string
    variant: "success" | "warning" | "error" | "info" | "neutral"
    icon: any
  }> = {
    pending: { 
      label: translations.status.pending, 
      variant: "warning",
      icon: Clock
    },
    in_review: { 
      label: translations.status.in_review, 
      variant: "info",
      icon: AlertCircle
    },
    approved: { 
      label: translations.status.approved, 
      variant: "success",
      icon: CheckCircle
    },
    closed: { 
      label: translations.status.closed, 
      variant: "neutral",
      icon: FileText
    },
    rejected: {
      label: translations.status.rejected, 
      variant: "error",
      icon: XCircle
    },
    advanced_closed: { 
      label: translations.status.advanced_closed, 
      variant: "neutral",
      icon: CheckCircle
    }
  }

  const priorityConfig: Record<SubsidyRequest["priority"], { 
    label: string
    variant: "success" | "warning" | "error" | "info" | "neutral"
  }> = {
    low: { label: translations.priority.low, variant: "neutral" },
    medium: { label: translations.priority.medium, variant: "warning" },
    high: { label: translations.priority.high, variant: "error" }
  }

  // Table columns
  const subsidyColumns: ColumnDef<SubsidyRequest>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: translations.table.requestTitle,
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="font-medium text-sm text-foreground">
                {row.original.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {row.original.church_name || row.original.institution_name}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "requested_amount",
      accessorKey: "requested_amount",
      header: translations.table.requested,
      cell: ({ row }) => (
        privacyConfigs?.tableMonetaryValues ? (
          <PrivacyWrapper 
            config={privacyConfigs.tableMonetaryValues}
            showToggle={false}
            className="inline-block"
            fallback={
              <div className="flex items-center gap-1 blur-[1px] opacity-40">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-gray-400" />
                ))}
              </div>
            }
          >
            <div className="text-sm font-semibold">
              {formatCurrency(row.original.requested_amount)}
            </div>
          </PrivacyWrapper>
        ) : (
          <div className="text-sm font-semibold">
            {formatCurrency(row.original.requested_amount)}
          </div>
        )
      ),
    },
    {
      id: "activities",
      accessorKey: "activities_count",
      header: translations.table.activities,
      cell: ({ row }) => (
        <div className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-fit">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {row.original.activities_count}
          </span>
        </div>
      ),
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: translations.table.priority,
      cell: ({ row }) => {
        const config = priorityConfig[row.original.priority]
        return (
          <StatusBadge
            label={config.label}
            variant={config.variant}
            size="sm"
            icon={Flag}
          />
        )
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: translations.table.status,
      cell: ({ row }) => {
        const config = statusConfig[row.original.status]
        const variantMap: Record<SubsidyRequest['status'], "success" | "warning" | "error" | "info" | "neutral"> = {
          pending: 'warning',
          in_review: 'info',
          approved: 'success',
          closed: 'success',
          rejected: 'error',
          advanced_closed: 'neutral'
        }
        const dotColorMap: Record<SubsidyRequest['status'], string> = {
          pending: 'bg-amber-500',
          in_review: 'bg-blue-500',
          approved: 'bg-green-500',
          closed: 'bg-emerald-600',
          rejected: 'bg-red-500',
          advanced_closed: 'bg-purple-600'
        }
        return (
          <StatusBadge
            label={config.label}
            variant={variantMap[row.original.status]}
            showDot={true}
            size="sm"
          />
        )
      },
    },
    {
      id: "requested_at",
      accessorKey: "requested_at",
      header: translations.table.date,
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {format(new Date(row.original.requested_at), "dd MMM yyyy", { locale: ptBR })}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">{translations.table.actions}</div>,
      cell: ({ row }) => (
        <div className="flex justify-end" data-action-button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewSubsidy(row.original.id)}>
                <Settings className="mr-2 h-4 w-4" />
                {translations.actions.manageSubsidy}
              </DropdownMenuItem>
              
              {/* Approve/Reject buttons for pending and in_review */}
              {(row.original.status === 'pending' || row.original.status === 'in_review') && (
                <>
                  <DropdownMenuSeparator />
                  <WithPermission requiredPermissions={[PermissionResolverName.ApproveSubsidyRequest]}>
                    <DropdownMenuItem 
                      onClick={() => handleApprove(row.original.id)}
                      className="text-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {translations.actions.approve}
                    </DropdownMenuItem>
                  </WithPermission>
                  <WithPermission requiredPermissions={[PermissionResolverName.RejectSubsidyRequest]}>
                    <DropdownMenuItem 
                      onClick={() => handleReject(row.original.id)}
                      className="text-red-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {translations.actions.reject}
                    </DropdownMenuItem>
                  </WithPermission>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  // Convert to Kanban format
  const kanbanGroups: KanbanGroup[] = [
    { id: 'pending', name: translations.kanban.groups.pending, color: '#f59e0b', tooltip: translations.statusRules.pending },
    { id: 'in_review', name: translations.kanban.groups.in_review, color: '#3b82f6', tooltip: translations.statusRules.in_review },
    { id: 'approved', name: translations.kanban.groups.approved, color: '#10b981', tooltip: translations.statusRules.approved },
    { id: 'advanced_closed', name: translations.kanban.groups.advanced_closed, color: '#7c3aed', tooltip: translations.statusRules.advanced_closed },
    { id: 'closed', name: translations.kanban.groups.closed, color: '#059669', tooltip: translations.statusRules.closed },
    { id: 'rejected', name: translations.kanban.groups.rejected, color: '#ef4444', tooltip: translations.statusRules.rejected },
  ]

  const kanbanItems: KanbanItem[] = subsidyRequests.map(request => ({
    id: request.id,
    groupId: request.status,
    title: request.title,
    description: request.church_name || request.institution_name,
    icon: statusConfig[request.status].icon,
    metadata: {
      requested_amount: formatCurrency(request.requested_amount),
      requested_amount_raw: request.requested_amount,
      activities_count: request.activities_count,
      priority: request.priority,
      requested_at: format(new Date(request.requested_at), "dd/MM/yyyy", { locale: ptBR }),
      is_for_advance: request.is_for_advance
    }
  }))

  const kanbanActions: KanbanAction[] = [
    {
      id: 'view',
      label: translations.actions.manageSubsidy,
      icon: Settings,
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id) handleViewSubsidy(item.id)
      }
    },
    {
      id: 'approve',
      label: translations.actions.approve,
      icon: CheckCircle,
      variant: 'default',
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id) handleApprove(item.id)
      }
    },
    {
      id: 'reject',
      label: translations.actions.reject,
      icon: XCircle,
      variant: 'destructive',
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id) handleReject(item.id)
      }
    }
  ]



  // Custom Kanban Item Renderer
  const renderKanbanItem = (item: KanbanItem, group: KanbanGroup, dragHandlers?: any) => {
    const itemActions = kanbanActions.filter(action => action.showInItem)
    const priority = item.metadata?.priority as SubsidyRequest["priority"] || 'low'
    
    // Priority flag colors
    const priorityFlagColors: Record<SubsidyRequest["priority"], string> = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    
    return (
      <div
        {...dragHandlers}
        className="bg-card border border-l-4 border-border rounded-md p-3 shadow-sm hover:shadow-md transition-all cursor-pointer mb-3 last:mb-0 relative"
        style={{ borderLeftColor: group.color }}
      >
        {/* Priority Flag */}
        <div className="absolute top-2 right-2">
          <div className={`w-2 h-2 rounded-full ${priorityFlagColors[priority]}`} title={priority} />
        </div>

        <div className="flex items-start justify-between gap-2 mb-2 pr-4">
          <h4 className="text-sm font-medium leading-tight">{item.title}</h4>
        </div>

        {item.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          {privacyConfigs?.kanbanMonetaryValues ? (
            <PrivacyWrapper
              config={privacyConfigs.kanbanMonetaryValues}
              showToggle={false}
              className="inline-block"
              fallback={
                <div className="flex items-center gap-1 blur-[1px] opacity-40">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  ))}
                </div>
              }
            >
              <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                {item.metadata?.requested_amount}
                <AdvanceSubsidyBadge isForAdvance={item.metadata?.is_for_advance} />
              </span>
            </PrivacyWrapper>
          ) : (
            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
              {item.metadata?.requested_amount}
              <AdvanceSubsidyBadge isForAdvance={item.metadata?.is_for_advance} />
            </span>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {itemActions.map(action => {
                const ActionIcon = action.icon
                return (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => action.onClick(group, item)}
                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                  >
                    <ActionIcon className="mr-2 h-4 w-4" />
                    {action.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  // View Toggle Component
  const ViewToggle = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('table')}
          className={viewMode === 'table' ? 'rounded-r-none bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' : 'rounded-r-none'}
        >
          <List className="h-4 w-4 mr-2" />
          {/* {translations.actions.viewToggle.table} */}
        </Button>
        <Button
          variant={viewMode === 'kanban' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('kanban')}
          className={viewMode === 'kanban' ? 'rounded-l-none bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' : 'rounded-l-none'}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          {/* {translations.actions.viewToggle.kanban} */}
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpandedView(true)}
        className="gap-2"
      >
        <Fullscreen className="h-4 w-4" />
      </Button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      {showKPICards && (
        <KPICards data={kpiCardsData} />
      )}

      {/* Charts Section */}
      {showCharts && (
        <AnalyticsGridCarousel
          className="w-full"
          enableAutoplay={false}
          autoplayDelay={5000}
        >
          {/* Requests by Department Chart */}
           <RequestsByDepartmentChart
            data={chartData.byDepartment}
            privacyConfig={privacyConfigs?.byDepartmentChart}
            loading={isLoading}
            selectedYear={new Date().getFullYear()}
            translations={translations.charts.byDepartment}
          />

          {/* Requests Over Time Chart */}
          <RequestsOverTimeChart
            data={chartData.byMonth}
            loading={isLoading}
            selectedYear={new Date().getFullYear()}
            translations={translations.charts.overTime}
          />

          {/* Status Overview Chart */}
          <StatusOverviewChart
            data={chartData.byStatus}
            loading={isLoading}
            translations={translations.charts.statusOverview}
          />

        </AnalyticsGridCarousel>
      )}

      {/* Subsidy Requests Table/Kanban */}
      <Card>
        <ChartHeader
          title={translations.card.title}
          description={translations.card.description}
          actionsOrientation="responsive"
          actions={
            <>
              {viewMode === 'table' && privacyConfigs?.tableMonetaryValues && (
                <InlinePrivacyToggle 
                  config={privacyConfigs.tableMonetaryValues}
                  className="w-8 h-8"
                />
              )}
              {viewMode === 'kanban' && privacyConfigs?.kanbanMonetaryValues && (
                <InlinePrivacyToggle 
                  config={privacyConfigs.kanbanMonetaryValues}
                  className="w-8 h-8"
                />
              )}
              <ViewToggle />
            </>
          }
        />
        <CardContent>
          {viewMode === 'table' ? (
            <UseTable
              data={subsidyRequests}
              columns={subsidyColumns}
            />
          ) : (
            <KanbanBoard
              groups={kanbanGroups}
              items={kanbanItems}
              actions={kanbanActions}
              onItemMove={handleKanbanItemMove}
              renderItem={renderKanbanItem}
            />
          )}
        </CardContent>
      </Card>

      {/* View Subsidy Modal */}
      {selectedSubsidy && (
        <ViewSubsidyModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedSubsidy(null)
          }}
          subsidy={selectedSubsidy}
          onSubsidyUpdated={async () => {
            if (refetchSubsidies) {
              await refetchSubsidies()
            }
          }}
        />
      )}
      
       {/* Confirmation Dialog */}
       <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog({ ...confirmationDialog, isOpen: false })}
        onConfirm={async () => {
            if (confirmationDialog.action === 'approve') {
                await executeApprove(confirmationDialog.itemId)
            } else if (confirmationDialog.action === 'close') {
                await executeStatusUpdate(confirmationDialog.itemId, 'closed')
            }
            setConfirmationDialog({ ...confirmationDialog, isOpen: false })
        }}
        title={t('subsidy.statusChange.title')}
        description={
             confirmationDialog.action === 'approve' 
             ? t('subsidy.statusChange.warning.approved')
             : confirmationDialog.action === 'close'
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

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog.isOpen} onOpenChange={(open) => !open && setRejectionDialog({ ...rejectionDialog, isOpen: false })}>
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
            <Button variant="outline" onClick={() => setRejectionDialog({ ...rejectionDialog, isOpen: false })} className="w-full sm:w-auto">
              {t('common.cancel')}
            </Button>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
                <Button variant="destructive" onClick={async () => {
                    await executeReject(rejectionDialog.itemId, rejectionDialog.reason)
                    setRejectionDialog({ ...rejectionDialog, isOpen: false })
                }} className="w-full">
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

      {/* Expanded View Modal */}
      <ExpandedViewModal
        isOpen={isExpandedView}
        onClose={() => setIsExpandedView(false)}
        title={`${translations.table.requestTitle}`}
        itemCount={subsidyRequests.length}
        itemCountLabel={translations.defaults.requests || 'solicitações'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        tableViewLabel={translations.actions.viewToggle.table}
        kanbanViewLabel={translations.actions.viewToggle.kanban}
        tablePrivacyConfig={privacyConfigs?.tableMonetaryValues}
        kanbanPrivacyConfig={privacyConfigs?.kanbanMonetaryValues}
      >
        <div className="flex-1 overflow-hidden p-6 flex flex-col h-full">
          {viewMode === 'table' ? (
            <UseTable
              data={subsidyRequests}
              columns={subsidyColumns}
              fillHeight={true}
            />
          ) : (
            <KanbanBoard
              groups={kanbanGroups}
              items={kanbanItems}
              actions={kanbanActions}
              onItemMove={handleKanbanItemMove}
              renderItem={renderKanbanItem}
            />
          )}
        </div>
      </ExpandedViewModal>
    </div>
  )
}
